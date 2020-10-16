import produce from 'immer';

export default function(context: any): void {
  context.hooks('reducer', produce);
}
