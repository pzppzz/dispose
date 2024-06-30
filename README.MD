# About

'**signal-disposer**'' is a library for managing and disposing events in `JavaScript` and `TypeScript`. It provides a simple and efficient way to handle event management in complex applications.

# Features

- Signal: A signal class that can be used to emit events and connect listeners.
- DisposableGroup: A group of disposable objects that can be disposed together.

# Install

```shell
npm install signal-disposer
# or
yarn add signal-disposer
```

# Usage

```typescript
import { Signal, DisposableGroup } from "signal-disposer";

const signal = new Signal();
signal.connect(() => {
	console.log("Signal emitted!");
});

// connect once
signal.once(() => {
	console.log("only execute once!");
});

// dispose
const disposable = signal.connect(() => {
	console.log("dispose me!");
});
disposable.dispose();

// dispose group
const group = new DisposableGroup();
group.add(
	signal.connect(() => {
		console.log("dispose group!");
	}),
);
group.dispose();
```

# License

MIT
