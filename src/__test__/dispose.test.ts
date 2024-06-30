import { describe, expect, it } from "vitest";
import { DisposableGroup, IDisposable } from "../dispose";

describe("Dispose", () => {
	it("should add a disposable to the group", () => {
		const disposable = { dispose: () => {} } satisfies IDisposable;
		const group = new DisposableGroup();
		group.add(disposable);
		expect(group.isEmpty).toBe(false);
	});

	it("should remove all disposables from the group", () => {
		const disposable = { dispose: () => {} } satisfies IDisposable;
		const group = new DisposableGroup();
		group.add(disposable);
		group.dispose();
		expect(group.isEmpty).toBe(true);
		expect(group.disposed).toBe(true);
	});

	it("should not add disposable to the group if it is already disposed", () => {
		const disposable = { dispose: () => {} } satisfies IDisposable;
		const group = new DisposableGroup();
		group.dispose();
		group.add(disposable);
		expect(group.isEmpty).toBe(true);
		expect(group.disposed).toBe(true);
	});

	it("should not add a group to itself", () => {
		const group = new DisposableGroup();
		expect(() => group.add(group)).toThrow(Error);
	});

	// forbidden undefined
	it("should not add a invalid disposable to the group", () => {
		const group = new DisposableGroup();
		// @ts-ignore
		expect(() => group.add(undefined)).toThrow(TypeError);
		expect(() =>
			group.add({
				// @ts-ignore
				dispose: "",
			}),
		).toThrow(Error);
	});
});
