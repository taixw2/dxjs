import * as sagaEffects from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import { SEP, GeneratorConstructor } from './const'
import invariant from 'invariant';
import * as deco from './decorators'

export {
  deco
};

export default (hookOpt = {}) => {
  const _hooks = {
    initState: {},
    injectToEffect: {},
    reducerEnhancer: [],
    middlewares: [],
    onError: [],
  };

  combinHooks();

  const _models = [];
  let _store = null;

  return {
    model,
    start,
    runSaga: _runSaga,
    getStore: _getStore,
    combineReducers: _combineReducers,
  };

  function combinHooks() {
    Object.keys(_hooks).forEach(key => {
      const hook = _hooks[key];
      if (Array.isArray(hook)) {
        hook.push(...(hookOpt[key] || []));
        return;
      }

      _hooks[key] = { ...hook, ...(hookOpt[key] || []) };
    });
  }

  /**
   * 构建 model
   *
   * @param {*} m
   * @param {*} args
   */
  function model(m, ...args) {
    if (process.env.NODE_ENV !== 'production') {
      checkModel(m);
    }

    _models.push(instantiateModel(m));

    function checkModel(m) {
      invariant(typeof m === 'function', 'model 必须是类');
      invariant(!_models.some(v => v.constructor.name === m.name), '已经存在相同的 model');
    }

    /**
     * 实例化 model
     *
     * @param {*} ModelClass 类
     */
    function instantiateModel(ModelClass) {
      const model = new ModelClass(...args);
      const reducers = {};
      const effects = [];

      const ModelProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(model));
      for (const props of ModelProperties) {
        const currentProps = model[props];
        if (props === "constructor") continue;
        if (props === "state") state = props.state;

        /**
         * 如果是 generator 函数则是 effect
         */
        if (currentProps instanceof GeneratorConstructor) {
          effects.push(sagaEffects.fork(createSagaEffect(props, currentProps)));
          continue;
        }

        /**
         * 如果是普通函数则是 reducers
         */
        if (typeof currentProps === 'function') {
          reducers[prefix(props)] = currentProps.bind(model);
          continue;
        }
      }

      function prefix(type) {
        return `${ModelClass.name}${SEP}${type}`;
      }

      /**
       * 重写 put 和 take, 使其默认 put/take 则添加 namespace/ 的前缀
       */
      function overSagaEffects() {
        function put(action) {
          return sagaEffects.put({
            ...action,
            type: action.type.includes(SEP) ? action.type : prefix(action.type),
          });
        }

        function $put(action) {
          return sagaEffects.put(action);
        }

        function take(type) {
          return sagaEffects.put(prefix(type));
        }

        function $take(type) {
          return sagaEffects.take(type);
        }

        return {
          ...sagaEffects,
          put,
          $put,
          $take,
          take,
        };
      }

      /**
       * 创建 saga
       * @param {*} type effect 名称
       * @param {*} effect effect 方法
       */
      function createSagaEffect(type, effect) {
        function* sagaWithCatch(action) {
          try {
            yield sagaEffects.put({ type: `${prefix(type)}@@start` });
            yield effect({ ...overSagaEffects(type), action });
            yield sagaEffects.put({ type: `${prefix(type)}@@end` });
          } catch (error) {
            callError(error);
          }
        }

        switch (true) {
          case type.toLowerCase().endsWith('takeLatest') || model.__takelatest.includes(type):
            return function*() {
              yield sagaEffects.takeLatest(prefix(type), sagaWithCatch);
            };
            break;
          case type.toLowerCase().endsWith('throttle') || model.__throttle.includes(type):
            return function*() {
              yield sagaEffects.throttle(350, prefix(type), sagaWithCatch);
            };
            break;
          default:
            return function*() {
              yield sagaEffects.takeEvery(prefix(type), sagaWithCatch);
            };
            break;
        }
        return sagaWithCatch;
      }

      model.namespace = ModelClass.name;
      model.effects = function *() {
        yield sagaEffects.all(effects)
      };
      // 不存在同名的 reducer
      model.reducers = (state, action) => {
        model.state = state;
        if (!reducers[action.type]) {
          return state;
        }
        return reducers[action.type].call(model, action, state)
      };
      return model;
    }
  }

  /**
   * 启动项目
   *
   */
  function start() {
    const composeEnhancers =
      process.env.NODE_ENV !== 'production' && win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, maxAge: 30 })
        : compose;

    const sagaMiddleware = createSagaMiddleware();

    _store = createStore(
      combineReducers(_combineReducers()),
      initState,
      composeEnhancers(applyMiddleware(sagaMiddleware, ..._hooks.middlewares)),
    );

    _models.forEach(({ effects }) => sagaMiddleware.run(sagaEffects.all(effects)));
  }

  function _combineReducers() {
    let reducers = {};
    for (const model of _models) {
      reducers[model.namespace] = _hooks.reducerEnhancer.reduce((pf, cf) => cf(pf, model.state), model.reducers)
    }
    return reducers;
  }

  function _runSaga(sagaMiddleware) {
    _models.forEach(({ effects }) => sagaMiddleware.run(effects))
  }

  function _getStore() {
    return _store;
  }

  function callError(error) {
    let _error = error;
    if (!(error instanceof Error)) {
      _error = new Error(error);
    }

    _hooks.onError.forEach(f => f(_error));
  }
};
