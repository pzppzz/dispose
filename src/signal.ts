import { DisposableGroup, IDisposable } from "./dispose";

export interface ISignalListener<T> {
	(data: T): unknown;
}

class SignalListenerContainer<T> {
	constructor(public readonly action: ISignalListener<T>) {}
}

export class Signal<T = void> implements IDisposable {
	protected _listeners: SignalListenerContainer<T>[] = [];

	protected _disposed = false;

	private _connect(
		listener: ISignalListener<T>,
		context?: unknown,
		disposables?: IDisposable[] | DisposableGroup,
		once?: boolean,
	): IDisposable | undefined {
		if (this._disposed) {
			console.warn("Cannot connect to a disposed signal!");
			return;
		}
		if (typeof listener !== "function") {
			console.error(`${listener} is not a valid function!`);
			throw new TypeError("listener must be a function");
		}
		let callback = (listener = context ? listener.bind(context) : listener);
		if (once) {
			let didFire = false;
			callback = (data: T) => {
				if (!didFire) {
					didFire = true;
					listener(data);
					this._disconnect(container);
				}
			};
		}
		let container = new SignalListenerContainer(callback);
		const disposable = {
			dispose: () => {
				if (container) {
					this._disconnect(container);
					container = null;
				}
			},
		};
		if (disposables instanceof DisposableGroup) {
			disposables.add(disposable);
		} else if (Array.isArray(disposables)) {
			disposables.push(disposable);
		}
		this._listeners.push(container);
		return disposable;
	}

	private _disconnect(listener: SignalListenerContainer<T>) {
		const listeners = this._listeners;
		if (listeners.length) {
			let removed = false;
			for (let i = 0; i < listeners.length; i++) {
				if (removed) {
					listeners[i - 1] = listeners[i];
				} else if (listener === listeners[i]) {
					removed = true;
				}
			}
			if (removed) {
				listeners.length--;
			}
		}
	}

	public connect(
		listener: ISignalListener<T>,
		context?: unknown,
		disposables?: IDisposable[] | DisposableGroup,
	): IDisposable {
		return this._connect(listener, context, disposables);
	}

	public once(listener: ISignalListener<T>, context?: unknown) {
		return this._connect(listener, context, undefined, true);
	}

	public trigger(data: T) {
		if (this._listeners.length) {
			const listeners = [...this._listeners];
			for (let i = 0; i < listeners.length; i++) {
				listeners[i].action(data);
			}
		}
	}

	public dispose(): void {
		if (!this._disposed) {
			this._disposed = true;
			this._listeners = [];
		}
	}

	public get hasListener(): boolean {
		return this._listeners.length > 0;
	}
}
