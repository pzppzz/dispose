import { describe, expect, it } from "vitest";
import { Signal } from "../signal";
import { DisposableGroup, IDisposable } from "../dispose";

describe("Signal", () => {
	it("should create a new Signal instance", () => {
		const signal = new Signal();
		expect(signal).toBeInstanceOf(Signal);
	});

	it("should add a listener to the signal", () => {
		const signal = new Signal();
		const listener = () => {};
		signal.connect(listener);
		expect(signal.hasListener).toBe(true);
	});

	it("should remove a listener from the signal when the listener is disposed", () => {
		const signal = new Signal();
		const listener = () => {};
		const disposable = signal.connect(listener);
		disposable.dispose();
		expect(signal.hasListener).toBe(false);
	});

	it("should invoke all listeners when the signal is dispatched", () => {
		let count = 0;
		const signal = new Signal();
		const listener1 = () => {
			count++;
		};
		const listener2 = () => {
			count++;
		};
		signal.connect(listener1);
		signal.connect(listener2);
		signal.trigger();
		expect(count).toBe(2);
	});

	it("should not invoke listeners after they are removed", () => {
		let count = 0;
		const signal = new Signal();
		const listener1 = () => {
			count++;
		};
		const listener2 = () => {
			count++;
		};
		signal.connect(listener1);
		const disposable2 = signal.connect(listener2);
		disposable2.dispose();
		signal.trigger();
		expect(count).toBe(1);
	});

	it("should receive arguments when the signal is dispatched", () => {
		const signal = new Signal<number>();
		const listener = (num: number) => {
			expect(num).toBe(666);
		};
		signal.connect(listener);
		signal.trigger(666);
	});

	it("should only invoke the listener once when the signal is dispatched", () => {
		let count = 0;
		const signal = new Signal();
		const listener = () => {
			count++;
		};
		signal.once(listener);
		signal.trigger();
		signal.trigger();
		expect(count).toBe(1);
		expect(signal.hasListener).toBe(false);
	});

	it("should remove all listeners when the signal is disposed", () => {
		const signal = new Signal();

		const listener1 = () => {};
		const listener2 = () => {};

		signal.connect(listener1);
		signal.connect(listener2);
		signal.dispose();

		expect(signal.hasListener).toBe(false);
	});

	it("should not add a listener if the signal is already disposed", () => {
		const signal = new Signal();
		signal.dispose();

		const listener = () => {};
		signal.connect(listener);

		expect(signal.hasListener).toBe(false);
	});

	it("should add a disposable to the disposables list when it's provided", () => {
		const signal = new Signal();
		const disposableGroup = new DisposableGroup();
		const disposableArray: IDisposable[] = [];

		const listener1 = () => {};
		const listener2 = () => {};

		signal.connect(listener1, null, disposableGroup);
		signal.connect(listener2, null, disposableArray);

		expect(disposableGroup.isEmpty).toBe(false);
		expect(disposableArray.length).toBe(1);
	});

	it("should correctly bind the context to the listener", () => {
		const signal = new Signal();
		const context = {};

		function listener() {
			expect(this).toBe(context);
		}

		signal.connect(listener, context);
		signal.trigger();
	});

	it("should not add a invalid listener", () => {
		const signal = new Signal();
		// @ts-ignore
		expect(() => signal.connect(null)).toThrow(Error);
		// @ts-ignore
		expect(() => signal.connect(undefined)).toThrow(Error);
	});
});
