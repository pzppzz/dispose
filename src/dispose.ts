export interface IDisposable {
	dispose(): void;
}

export class DisposableGroup implements IDisposable {
	private _group: Set<IDisposable> = new Set();

	private _disposed = false;

	private _clear(): void {
		this._group.forEach((disposable) => {
			disposable.dispose();
		});
		this._group.clear();
	}

	public get disposed(): boolean {
		return this._disposed;
	}

	public add<T extends IDisposable>(disposable: T): T {
		if (typeof disposable?.dispose !== "function") {
			// 这里可以添加一些错误处理逻辑
			throw new TypeError(`${disposable} is not a valid disposable object!`);
		}

		if (this._disposed) {
			disposable.dispose();
			return disposable;
		}

		if ((disposable as unknown as DisposableGroup) === this) {
			throw new Error("Cannot add a disposable to itself.");
		}

		this._group.add(disposable);

		return disposable;
	}

	public dispose(): void {
		if (!this._disposed) {
			this._disposed = true;
			this._clear();
		}
	}

	public get isEmpty(): boolean {
		return this._group.size === 0;
	}

	public addFromNative<T extends keyof WindowEventMap>(
		target: Window,
		type: T,
		cb: (evt: WindowEventMap[T]) => void,
		options?: boolean | AddEventListenerOptions,
	): DisposableGroup;
	public addFromNative<T extends keyof DocumentEventMap>(
		target: Document,
		type: T,
		cb: (evt: DocumentEventMap[T]) => void,
		options?: boolean | AddEventListenerOptions,
	): DisposableGroup;
	public addFromNative<T extends keyof HTMLElementEventMap>(
		target: HTMLElement,
		type: T,
		cb: (evt: HTMLElementEventMap[T]) => void,
		options?: boolean | AddEventListenerOptions,
	): DisposableGroup;
	public addFromNative(
		target: HTMLElement | Window | Document,
		type: string,
		cb: (evt: Event) => void,
		options?: boolean | AddEventListenerOptions,
	) {
		this.add({
			dispose: () => {
				target.removeEventListener(type, cb, options);
			},
		});
		target.addEventListener(type, cb, options);
		return this;
	}
}
