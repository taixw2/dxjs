/**
 * 获取 model name 的唯一标识
 * model name 会放在 model 构造器中的 matedata 中
 * 以 model name 来关联对应的 Model 构造器
 *
 * Model Name 通常是构造器的名称，但是也可以设置别名
 */
export const MODEL_NAME = Symbol('__model_name');

/**
 * 用于获取作为 reducer 的 key,
 * 只有使用装饰器 @Reducer 表明的，才算一个有效 key
 */
export const RECORD_REDUCER_KEYS = Symbol('__record_reducer_keys');

/**
 * 用来标明 类 或者 方法
 * 可用于决定某个增强器是否适用于此类/方法
 */
export const LABEL = Symbol('__label');

/**
 * reducer 方法
 *
 * 用于获取类中的 reducer 方法，如
 *
 * (Reflect.getMetadata(Model, REDUCER_METHODS_KEY) as Map<symbol, string>).get(action.type)
 */
export const REDUCER_METHODS_KEY = Symbol('__reducer_method');

/**
 * reducer 增强器，
 * 用于获取某个 reducer 的增强器
 */
export const REDUCER_ENHANCER_KEY = Symbol('__reducer_enhancer');

/**
 * effect 的 helper 别名
 */
export const TAKE_LATEST = Symbol('__take_latest');
export const TAKE_EVERY = Symbol('__take_every');
export const TAKE_LEADING = Symbol('__take_leading');
export const THROTTLE = Symbol('throttle');

/**
 * effect 方法
 *
 * 用于获取类中的 effect 方法，如
 *
 * (Reflect.getMetadata(Model, EFFECT_METHODS_KEY) as Map<symbol, string>)
 */
export const EFFECT_METHODS_KEY = Symbol('__effect_method');
