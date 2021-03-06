import { BaseTask } from './task';

export class BaseEvent {
  static displayName = 'BaseEvent';

  constructor(...args: any[]) {
    void args;
  }
}

/** 开始 */
export class StartEvent extends BaseEvent {
  static displayName = 'Start';
}

/** 每个 yield 事件 */
export class YieldEvent extends BaseEvent {
  static displayName = 'Yield';
  constructor(public readonly value: any, public readonly task: BaseTask<any>) {
    super();
  }
}

/** 某个 iterator 结束 */
export class DoneEvent extends BaseEvent {
  static displayName = 'Done';
  constructor(public error: Error, public value: any, public readonly task: BaseTask<any>) {
    super();
  }
}

/** 所有 iterator 结束 */
export class EmptyEvent extends BaseEvent {
  static displayName = 'Empty';
}

/** 取消 */
export class CancelEvent extends BaseEvent {
  static displayName = 'Cancel';
}

/** 暂停 */
export class PauseEvent extends BaseEvent {
  static displayName = 'Pause';
}

/** 恢复 */
export class ResumeEvent extends BaseEvent {
  static displayName = 'Resume';
}

/** 全局要用的 event */
export const EVENT = {
  Start: StartEvent,
  Yield: YieldEvent,
  Done: DoneEvent,
  Empty: EmptyEvent,
  Cancel: CancelEvent,
  Pause: PauseEvent,
  Resume: ResumeEvent,
};

export class EventBus {
  private handleMap = new Map<BaseEvent, Function[]>();

  emit<T extends BaseEvent>(event: T) {
    const handlers = this.handleMap.get(event.constructor) || [];
    handlers.forEach(h => h(event));

    return this;
  }

  on<T extends typeof BaseEvent>(type: T, handler: (event: InstanceType<T>) => void) {
    this.handleMap.set(type, [...(this.handleMap.get(type) || []), handler]);
    return this;
  }

  off<T extends typeof BaseEvent>(type?: T, handler?: Function) {
    // 卸载指定 handler
    if (type && handler) {
      this.handleMap.set(
        type,
        [...(this.handleMap.get(type) || [])].filter(_h => _h !== handler)
      );
      return this;
    }

    // 卸载指定 type 的 handler
    if (type) {
      this.handleMap.delete(type);
      return this;
    }

    // 卸载所有
    this.handleMap.clear();
    return this;
  }
}
