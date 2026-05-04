export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  module: string;
  moduleIndex: number;
  title: string;
  description: string;
  content: string;
  codeExample: string;
  quiz: QuizQuestion[];
}

export const modules = [
  'Getting Started',
  'Core Concepts',
  'Hooks Deep Dive',
  'State Management',
  'Advanced Patterns',
];

export const lessons: Lesson[] = [
  // Module 1: Getting Started
  {
    id: '01-what-is-react',
    module: 'Getting Started',
    moduleIndex: 0,
    title: 'What is React?',
    description: 'Understand what React is and why it exists.',
    content: `React is a **JavaScript library** for building user interfaces. Created by Facebook in 2013, it changed how we think about building web apps.

**Why React?**
- **Component-based**: Build encapsulated pieces of UI that manage their own state, then compose them into complex interfaces.
- **Declarative**: Describe what your UI should look like for a given state, and React efficiently updates it when data changes.
- **Learn once, write anywhere**: Develop new features without rewriting existing code. React can also render on the server using Node.js.

**The Virtual DOM**
React uses a virtual representation of the real DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous one (diffing), and only updates the real DOM nodes that actually changed. This makes updates fast.

**React vs Alternatives**
Unlike full frameworks (Angular, Vue), React focuses only on the view layer. Routing, state management, and other concerns are handled by the ecosystem — giving you flexibility to choose the right tool for each job.`,
    codeExample: `// React is just a library — you import it
import React from 'react';
import ReactDOM from 'react-dom/client';

// A simple React element
const element = <h1>Hello, React!</h1>;

// Render it to the DOM
const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
root.render(element);`,
    quiz: [
      { question: 'What is React?', options: ['A CSS framework', 'A JavaScript library for building UIs', 'A database tool', 'A server framework'], correctIndex: 1 },
      { question: 'What does React use to optimize DOM updates?', options: ['Shadow DOM', 'Virtual DOM', 'Real DOM', 'CSS Grid'], correctIndex: 1 },
    ],
  },
  {
    id: '02-jsx',
    module: 'Getting Started',
    moduleIndex: 0,
    title: 'JSX Syntax',
    description: 'Learn the syntax that makes React readable.',
    content: `**JSX** is a syntax extension for JavaScript that lets you write HTML-like code inside your JavaScript. It compiles down to \`React.createElement()\` calls.

**Key Rules:**
1. **Return a single root element** — JSX must return one parent element. Wrap siblings in a \`<div>\` or React Fragment \`<>\`.
2. **Close every tag** — Self-closing tags like \`<img />\` must be closed. Even components: \`<MyComponent />\`.
3. **Use camelCase** — \`class\` becomes \`className\`, \`onclick\` becomes \`onClick\`, \`tabindex\` becomes \`tabIndex\`.
4. **Curly braces for JS** — Use \`{ }\` to embed any JavaScript expression inside JSX.

**Expressions in JSX:**
You can put any JavaScript expression inside curly braces: variables, function calls, ternaries, template literals. But NOT statements (no if/else, for loops — use ternaries and .map() instead).

**JSX is optional** but almost universally used because it's far more readable than nested \`createElement\` calls.`,
    codeExample: `// JSX — looks like HTML but it's JavaScript
const name = "Developer";

function Greeting() {
  return (
    // Must return a single root element
    <div className="card">
      {/* Curly braces for JS expressions */}
      <h1>Hello, {name}!</h1>
      <p>2 + 2 = {2 + 2}</p>

      {/* Ternary for conditional rendering */}
      <p>{name ? \`Welcome \${name}\` : 'Please log in'}</p>

      {/* .map() for lists — always set key! */}
      {['React', 'Vue', 'Svelte'].map(fw => (
        <li key={fw}>{fw}</li>
      ))}
    </div>
  );
}`,
    quiz: [
      { question: 'What must JSX return?', options: ['An array', 'A single root element', 'A string', 'Nothing'], correctIndex: 1 },
      { question: 'How do you embed JavaScript in JSX?', options: ['Using $( )', 'Using { }', 'Using [ ]', 'Using < >'], correctIndex: 1 },
    ],
  },
  {
    id: '03-components',
    module: 'Getting Started',
    moduleIndex: 0,
    title: 'Components',
    description: 'The building blocks of every React app.',
    content: `**Components** are the core building block of React. A component is a JavaScript function that returns JSX (UI).

**Two types:**
- **Function components** — The modern standard. Plain JavaScript functions.
- **Class components** — Legacy pattern. Still works but hooks made them unnecessary.

**Component Rules:**
1. Name must start with a **capital letter** — \`<Button />\` is a component, \`<button />\` is HTML.
2. Must return valid JSX.
3. Can be composed — components inside components.

**Props:**
Components accept inputs called **props** (properties). Props are read-only — a component must never modify its own props. This makes components predictable and easy to debug.

**Composition over Inheritance:**
React favors composition. Instead of inheriting from a base component, you pass components as props (children) or use custom hooks to share logic.`,
    codeExample: `// A component is just a function that returns JSX
function Avatar({ name, imageUrl }: {
  name: string;
  imageUrl: string;
}) {
  return (
    <div className="avatar">
      <img src={imageUrl} alt={name} />
      <span>{name}</span>
    </div>
  );
}

// Compose components together
function Profile() {
  return (
    <div>
      <h1>Team Members</h1>
      <Avatar name="Alice" imageUrl="/alice.jpg" />
      <Avatar name="Bob" imageUrl="/bob.jpg" />
    </div>
  );
}`,
    quiz: [
      { question: 'Why must component names start with a capital letter?', options: ['For style reasons', 'To distinguish from HTML elements', 'It is optional', 'For performance'], correctIndex: 1 },
      { question: 'Can a component modify its own props?', options: ['Yes, anytime', 'No, props are read-only', 'Only in class components', 'Only with hooks'], correctIndex: 1 },
    ],
  },
  {
    id: '04-props',
    module: 'Getting Started',
    moduleIndex: 0,
    title: 'Props Deep Dive',
    description: 'Master passing data through your component tree.',
    content: `**Props** are how data flows down the component tree in React. Think of them like function arguments.

**Key Concepts:**

1. **Destructuring** — Pull out just the props you need: \`function Card({ title, children }) {}\`

2. **Default values** — Set fallbacks with default parameters: \`function Card({ size = 'md' }) {}\`

3. **children prop** — Any content between opening and closing tags becomes \`props.children\`. This is the primary composition mechanism.

4. **Spreading props** — \`<Component {...props} />\` passes all properties. Useful but use sparingly.

5. **Prop types** — In TypeScript, define prop interfaces for type safety and autocompletion.

**One-way data flow:**
Data flows down (parent to child) via props. Events flow up (child to parent) via callback props. This unidirectional flow makes apps predictable.`,
    codeExample: `interface CardProps {
  title: string;
  subtitle?: string;  // optional
  size?: 'sm' | 'md' | 'lg';  // default 'md'
  children: React.ReactNode;
  onAction?: () => void;  // callback prop
}

function Card({ title, subtitle, size = 'md', children, onAction }: CardProps) {
  return (
    <div className={\`card card-\${size}\`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {/* children renders whatever is between tags */}
      <div>{children}</div>
      {onAction && <button onClick={onAction}>Go</button>}
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="Welcome" onAction={() => alert('Hi!')}>
      <p>This is passed as children</p>
    </Card>
  );
}`,
    quiz: [
      { question: 'What is the children prop?', options: ['A special state', 'Content between opening and closing component tags', 'The first prop', 'A hook'], correctIndex: 1 },
      { question: 'Which direction does data flow in React?', options: ['Child to parent', 'Parent to child (one-way)', 'Both ways equally', 'Random'], correctIndex: 1 },
    ],
  },

  // Module 2: Core Concepts
  {
    id: '05-state',
    module: 'Core Concepts',
    moduleIndex: 1,
    title: 'useState',
    description: 'Add memory to your components.',
    content: `**useState** is the most fundamental hook. It gives components the ability to "remember" things.

\`const [value, setValue] = useState(initialValue);\`

**How it works:**
- \`value\` — the current state value
- \`setValue\` — a function to update it (triggers a re-render)
- \`initialValue\` — used only on the first render

**Important Rules:**
1. **State is isolated** — Each component instance has its own state.
2. **Updates are asynchronous** — React batches state updates for performance. You won't see the new value immediately after calling setValue.
3. **Never mutate state directly** — Always use the setter. For objects/arrays, create new ones: \`setItems([...items, newItem])\`.
4. **Functional updates** — When new state depends on previous state, use the callback form: \`setCount(prev => prev + 1)\`.

**Common mistake:**
Storing derived values in state. If you can compute a value from existing state or props, don't store it — just compute it during render.`,
    codeExample: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // Functional update — uses previous state
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
    </div>
  );
}

// Updating arrays (never mutate!)
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);

  const add = (text: string) => {
    setTodos([...todos, text]);  // spread creates new array
  };

  const remove = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i} onClick={() => remove(i)}>{todo}</li>
      ))}
    </ul>
  );
}`,
    quiz: [
      { question: 'What does useState return?', options: ['Just the value', 'An object', 'An array with value and setter', 'A promise'], correctIndex: 2 },
      { question: 'How should you update state that depends on the previous value?', options: ['setCount(count + 1)', 'setCount(prev => prev + 1)', 'count++', 'this.setState'], correctIndex: 1 },
    ],
  },
  {
    id: '06-rendering',
    module: 'Core Concepts',
    moduleIndex: 1,
    title: 'Rendering & Re-renders',
    description: 'Understand when and why React re-renders.',
    content: `**Rendering** is React calling your component function to produce UI. Understanding when renders happen is key to writing performant React.

**When does a component re-render?**
1. Its **state** changes (via setter)
2. Its **parent** re-renders (even if its props didn't change)
3. Its **context** value changes

**Render phase vs Commit phase:**
- **Render phase**: React calls your component, calculates the new virtual DOM. This can be interrupted.
- **Commit phase**: React applies changes to the real DOM. This is synchronous.

**Key insight:**
A re-render doesn't mean the DOM changes. React compares the new virtual DOM with the previous one and only updates what changed. If nothing changed, no DOM operations happen.

**Batching:**
React batches multiple state updates into a single re-render. Inside event handlers, all setState calls are batched. In React 18, this also applies to promises, setTimeout, and native event handlers.

**Avoiding unnecessary renders:**
- Don't create new objects/arrays/functions in render (they break memoization)
- Use \`React.memo\` for pure components
- Use \`useMemo\` and \`useCallback\` for expensive computations and stable callbacks`,
    codeExample: `import { useState } from 'react';

// React batches these — only ONE re-render
function BatchingExample() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    // These are batched into a single re-render
    setCount(c => c + 1);
    setFlag(f => !f);
    console.log(count, flag); // Still old values!
  };

  return <button onClick={handleClick}>Click me</button>;
}

// Parent re-render causes child re-render
function Parent() {
  const [value, setValue] = useState(0);
  return (
    <div>
      <button onClick={() => setValue(v => v + 1)}>
        Re-render parent
      </button>
      {/* This re-renders even though it has no props */}
      <Child />
    </div>
  );
}

function Child() {
  console.log('Child rendered');
  return <p>I am the child</p>;
}`,
    quiz: [
      { question: 'What triggers a re-render?', options: ['Only state changes', 'State changes, parent re-renders, context changes', 'Only prop changes', 'Manual DOM updates'], correctIndex: 1 },
      { question: 'Does a re-render always change the DOM?', options: ['Yes, always', 'No, React diffs and only updates what changed', 'Only for class components', 'Only on first render'], correctIndex: 1 },
    ],
  },
  {
    id: '07-events',
    module: 'Core Concepts',
    moduleIndex: 1,
    title: 'Event Handling',
    description: 'Respond to user interactions.',
    content: `React uses **synthetic events** — a cross-browser wrapper around native browser events. They work identically across all browsers.

**Syntax:**
- Use camelCase: \`onClick\`, \`onChange\`, \`onSubmit\`
- Pass a function reference, not a function call: \`onClick={handleClick}\` not \`onClick={handleClick()}\`

**Common Events:**
- \`onClick\` — button clicks
- \`onChange\` — input changes (fires on every keystroke for text inputs)
- \`onSubmit\` — form submission (remember \`e.preventDefault()\`)
- \`onKeyDown\`, \`onKeyUp\` — keyboard events
- \`onMouseEnter\`, \`onMouseLeave\` — hover effects

**Event handler patterns:**
- Inline arrow function: \`onClick={() => doSomething(id)}\` — creates new function each render
- Function reference: \`onClick={handleClick}\` — stable, preferred
- Curried handler: \`onClick={handleClick(id)}\` returns a function

**Controlled vs Uncontrolled:**
In React, you typically make inputs "controlled" by tying their value to state. This gives you full control over the input's value at all times.`,
    codeExample: `import { useState } from 'react';

function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    console.log({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Controlled input — value driven by state */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Keyboard events
function SearchBox() {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Perform search
      console.log('Searching:', query);
    }
    if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search..."
    />
  );
}`,
    quiz: [
      { question: 'How do you prevent default form submission in React?', options: ['return false', 'e.preventDefault()', 'e.stopPropagation()', 'event.cancel()'], correctIndex: 1 },
      { question: 'What is a controlled input?', options: ['An input with no state', 'An input whose value is driven by React state', 'An input that cannot be edited', 'A disabled input'], correctIndex: 1 },
    ],
  },
  {
    id: '08-conditional',
    module: 'Core Concepts',
    moduleIndex: 1,
    title: 'Conditional Rendering',
    description: 'Show different UI based on state.',
    content: `React doesn't have a special "if" syntax for JSX. Instead, you use plain JavaScript techniques.

**Patterns:**

1. **Ternary** — \`{isLoggedIn ? <Dashboard /> : <Login />}\` — Best for either/or rendering.

2. **Logical AND** — \`{items.length > 0 && <ItemList />}\` — Best for "render or render nothing". Returns the right side if left is truthy, otherwise returns the falsy value (which React ignores).

3. **Early return** — Return null from a component to render nothing. Good for guard clauses.

4. **Variable assignment** — Set a variable to JSX before the return, then embed it.

**Common mistake:**
Using \`&&\` with a number like \`{count && <p>{count}</p>}\`. If count is 0, React renders "0" (because 0 is falsy but a valid React node). Fix: \`{count > 0 && <p>{count}</p>}\`.`,
    codeExample: `import { useState } from 'react';

function ConditionalExamples() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState(['Apple', 'Banana']);
  const [error, setError] = useState<string | null>(null);

  // Pattern 1: Ternary (either/or)
  return (
    <div>
      {isLoggedIn ? (
        <button onClick={() => setIsLoggedIn(false)}>Log out</button>
      ) : (
        <button onClick={() => setIsLoggedIn(true)}>Log in</button>
      )}

      {/* Pattern 2: Logical AND */}
      {items.length > 0 && (
        <ul>
          {items.map(item => <li key={item}>{item}</li>)}
        </ul>
      )}

      {/* Pattern 3: Null check for optional data */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

// Pattern 4: Early return
function UserCard({ user }: { user?: { name: string } }) {
  if (!user) return <p>No user data</p>;

  return <h2>{user.name}</h2>;
}`,
    quiz: [
      { question: 'What happens with {0 && <Component />} in JSX?', options: ['Nothing renders', 'Renders "0"', 'Throws an error', 'Renders Component'], correctIndex: 1 },
      { question: 'Which pattern is best for either/or rendering?', options: ['Logical AND', 'Ternary operator', 'Early return', 'Variable assignment'], correctIndex: 1 },
    ],
  },

  // Module 3: Hooks Deep Dive
  {
    id: '09-useeffect',
    module: 'Hooks Deep Dive',
    moduleIndex: 2,
    title: 'useEffect',
    description: 'Side effects and lifecycle in function components.',
    content: `**useEffect** lets you synchronize a component with an external system — API calls, subscriptions, timers, DOM manipulation.

\`useEffect(setup, dependencies?)\`

**The dependency array controls when the effect runs:**
- **No array** — Runs after every render
- **Empty array \`[]\`** — Runs only on mount (first render)
- **\`[a, b]\`** — Runs when a or b changes

**Cleanup:**
Return a function from useEffect to clean up — unsubscribe, clear timers, abort fetches. React runs cleanup before the next effect and on unmount.

**Common patterns:**
- Fetch data on mount: \`useEffect(() => { fetchData() }, [])\`
- Subscribe to events: \`useEffect(() => { el.addEventListener(...); return () => el.removeEventListener(...) }, [])\`
- React to prop changes: \`useEffect(() => { sync(id) }, [id])\`

**Rules:**
1. Don't call useEffect inside loops or conditions — put the condition inside.
2. Every value used inside the effect should be in the dependency array (use the eslint plugin).
3. Effects run after render, not during.`,
    codeExample: `import { useState, useEffect } from 'react';

// Fetch data on mount
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(\`/api/users/\${userId}\`);
      const data = await res.json();
      if (!cancelled) setUser(data);
    }

    load();
    // Cleanup: prevent state update if component unmounted
    return () => { cancelled = true; };
  }, [userId]); // Re-run when userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}

// Subscribe with cleanup
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>Width: {width}px</p>;
}`,
    quiz: [
      { question: 'When does useEffect with an empty dependency array run?', options: ['Every render', 'Only on mount', 'Never', 'On unmount'], correctIndex: 1 },
      { question: 'What does the cleanup function in useEffect do?', options: ['Resets state', 'Runs before the next effect and on unmount', 'Prevents re-renders', 'Stops the component'], correctIndex: 1 },
    ],
  },
  {
    id: '10-usereducer',
    module: 'Hooks Deep Dive',
    moduleIndex: 2,
    title: 'useReducer',
    description: 'Manage complex state logic with reducers.',
    content: `**useReducer** is an alternative to useState for complex state logic. It uses the reducer pattern from Redux.

\`const [state, dispatch] = useReducer(reducer, initialState);\`

**When to use useReducer over useState:**
- Next state depends on the previous state in complex ways
- State has multiple sub-values that change together
- You want predictable state transitions
- The update logic is too complex for a simple setter

**How it works:**
1. You define a **reducer function**: \`(state, action) => newState\`
2. You **dispatch actions**: \`dispatch({ type: 'INCREMENT' })\`
3. The reducer processes the action and returns new state
4. React re-renders with the new state

**Benefits:**
- State transitions are explicit and testable
- Business logic is centralized in the reducer
- Easy to add new state transitions
- Reducers are pure functions — easy to unit test`,
    codeExample: `import { useReducer } from 'react';

interface State {
  count: number;
  step: number;
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_STEP'; step: number }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step };
    case 'DECREMENT':
      return { ...state, count: state.count - state.step };
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'RESET':
      return { count: 0, step: 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    step: 1,
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({
          type: 'SET_STEP',
          step: Number(e.target.value),
        })}
      />
    </div>
  );
}`,
    quiz: [
      { question: 'What does a reducer function return?', options: ['A component', 'The new state', 'A promise', 'An action'], correctIndex: 1 },
      { question: 'When should you prefer useReducer over useState?', options: ['Always', 'For complex state with multiple related values', 'Only in class components', 'Never'], correctIndex: 1 },
    ],
  },
  {
    id: '11-usecontext',
    module: 'Hooks Deep Dive',
    moduleIndex: 2,
    title: 'useContext',
    description: 'Share data across the tree without prop drilling.',
    content: `**useContext** lets you read data from a context without passing props through every level of the tree.

**The Problem (Prop Drilling):**
Without context, if a deeply nested component needs a value from a top-level ancestor, you must pass it as a prop through every intermediate component — even if they don't use it.

**How Context Works:**
1. **Create**: \`const ThemeContext = createContext(defaultValue)\`
2. **Provide**: \`<ThemeContext.Provider value={theme}>...\` wraps the tree
3. **Consume**: \`const theme = useContext(ThemeContext)\` in any descendant

**When to use Context:**
- Theme (dark/light mode)
- Current user / auth state
- Locale / language
- Global app settings

**When NOT to use Context:**
- For state that changes very frequently (causes all consumers to re-render)
- As a replacement for all props (some props should stay explicit)

**Performance tip:**
If the context value is an object, memoize it with useMemo to prevent unnecessary re-renders of consumers.`,
    codeExample: `import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Create context
const ThemeContext = createContext<'light' | 'dark'>('light');

// 2. Create provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Consume in any descendant — no prop drilling!
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}>
      I am {theme}
    </button>
  );
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}`,
    quiz: [
      { question: 'What problem does useContext solve?', options: ['Slow rendering', 'Prop drilling', 'Memory leaks', 'Type errors'], correctIndex: 1 },
      { question: 'What happens when a context value changes?', options: ['Only the provider re-renders', 'All consumers of that context re-render', 'Nothing', 'The app crashes'], correctIndex: 1 },
    ],
  },
  {
    id: '12-custom-hooks',
    module: 'Hooks Deep Dive',
    moduleIndex: 2,
    title: 'Custom Hooks',
    description: 'Extract and reuse stateful logic.',
    content: `**Custom hooks** let you extract component logic into reusable functions. A custom hook is just a function whose name starts with "use" and that calls other hooks.

**Rules:**
1. Name must start with \`use\` (e.g., \`useLocalStorage\`, \`useFetch\`)
2. Can call other hooks inside (useState, useEffect, etc.)
3. Must be called at the top level of a component (same rules as built-in hooks)

**Why custom hooks?**
- **Reuse logic** across components without copy-pasting
- **Separate concerns** — keep components focused on UI, hooks handle logic
- **Compose** — hooks can use other hooks
- **Test** — hook logic can be tested independently

**Common custom hooks:**
- \`useLocalStorage\` — persist state to localStorage
- \`useFetch\` — data fetching with loading/error states
- \`useDebounce\` — debounce rapidly changing values
- \`useMediaQuery\` — respond to screen size changes
- \`useToggle\` — boolean state with toggle helper`,
    codeExample: `import { useState, useEffect } from 'react';

// Custom hook: persist state to localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Custom hook: data fetching
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(res => res.json())
      .then(json => { if (!cancelled) setData(json); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [url]);

  return { data, error, loading };
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');
  const { data, loading } = useFetch<User[]>('/api/users');

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      {loading ? <p>Loading...</p> : <UserList users={data} />}
    </div>
  );
}`,
    quiz: [
      { question: 'What must a custom hook name start with?', options: ['get', 'use', 'hook', 'on'], correctIndex: 1 },
      { question: 'Why extract logic into custom hooks?', options: ['For performance only', 'To reuse stateful logic across components', 'Because React requires it', 'To avoid using useState'], correctIndex: 1 },
    ],
  },

  // Module 4: State Management
  {
    id: '13-lifting-state',
    module: 'State Management',
    moduleIndex: 3,
    title: 'Lifting State Up',
    description: 'Share state between sibling components.',
    content: `When two sibling components need to share state, you **lift the state up** to their closest common parent. The parent holds the state and passes it down as props.

**The Pattern:**
1. Find the closest common parent of the components that need the data
2. Move the state to that parent
3. Pass state down as props
4. Pass event handlers down as callback props for children to update the parent's state

**This is the fundamental React pattern for sharing state.** Before reaching for context or external state libraries, see if lifting state up solves your problem.

**When to lift state:**
- Two siblings need the same data
- A parent needs to coordinate child components
- A child needs to communicate with a sibling

**When NOT to lift state:**
- The state is only used by one component — keep it local
- The parent is many levels away — consider context instead`,
    codeExample: `import { useState } from 'react';

// Problem: both inputs need to stay in sync
// Solution: lift state to parent

function TemperatureInput({
  temperature,
  scale,
  onTemperatureChange,
}: {
  temperature: string;
  scale: 'c' | 'f';
  onTemperatureChange: (value: string) => void;
}) {
  return (
    <input
      value={temperature}
      onChange={e => onTemperatureChange(e.target.value)}
      placeholder={scale === 'c' ? 'Celsius' : 'Fahrenheit'}
    />
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  const handleCelsius = (value: string) => {
    setCelsius(value);
    setFahrenheit(value ? String(parseFloat(value) * 9/5 + 32) : '');
  };

  const handleFahrenheit = (value: string) => {
    setFahrenheit(value);
    setCelsius(value ? String((parseFloat(value) - 32) * 5/9) : '');
  };

  return (
    <div>
      <TemperatureInput
        temperature={celsius}
        scale="c"
        onTemperatureChange={handleCelsius}
      />
      <TemperatureInput
        temperature={fahrenheit}
        scale="f"
        onTemperatureChange={handleFahrenheit}
      />
    </div>
  );
}`,
    quiz: [
      { question: 'Where should shared state between siblings live?', options: ['In the first sibling', 'In the closest common parent', 'In localStorage', 'In a global store'], correctIndex: 1 },
      { question: 'How do children update the parent state?', options: ['Directly modifying parent state', 'Through callback props', 'Using context', 'They cannot'], correctIndex: 1 },
    ],
  },
  {
    id: '14-forms',
    module: 'State Management',
    moduleIndex: 3,
    title: 'Forms & Validation',
    description: 'Handle complex form state and validation.',
    content: `Forms are one of the most common UI patterns. React gives you full control over form behavior.

**Controlled Components:**
Every form input's value is driven by React state. You set \`value\` and \`onChange\` on every input. This gives you:
- Real-time validation
- Conditional formatting
- Disabled state control
- Instant access to form values

**Form Patterns:**
1. **Single state object** — One state for the whole form
2. **Individual states** — Separate state per field
3. **Custom hook** — \`useForm\` that handles values, errors, and submission

**Validation:**
- Validate on change (immediate feedback)
- Validate on blur (after user leaves field)
- Validate on submit (before sending data)

**Key tip:**
Always use \`e.preventDefault()\` in onSubmit to prevent the browser's default form submission (full page reload).`,
    codeExample: `import { useState } from 'react';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginForm() {
  const [data, setData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!data.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email))
      errs.email = 'Invalid email';
    if (!data.password) errs.password = 'Password is required';
    else if (data.password.length < 6)
      errs.password = 'Min 6 characters';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      // Submit data...
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={data.email}
          onChange={e => setData(d => ({ ...d, email: e.target.value }))}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <input
          type="password"
          value={data.password}
          onChange={e => setData(d => ({ ...d, password: e.target.value }))}
          placeholder="Password"
        />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">Log in</button>
      {submitted && <p>Success!</p>}
    </form>
  );
}`,
    quiz: [
      { question: 'What is a controlled input?', options: ['An input React cannot modify', 'An input whose value is driven by state', 'A read-only input', 'A native HTML input'], correctIndex: 1 },
      { question: 'Why use e.preventDefault() in form onSubmit?', options: ['To validate', 'To prevent browser page reload', 'To clear the form', 'To enable TypeScript'], correctIndex: 1 },
    ],
  },
  {
    id: '15-data-fetching',
    module: 'State Management',
    moduleIndex: 3,
    title: 'Data Fetching Patterns',
    description: 'Load and display data from APIs.',
    content: `Fetching data in React involves managing three states: **loading**, **error**, and **data**.

**Basic Pattern with useEffect:**
\`\`\`
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
\`\`\`

**Race Conditions:**
When a component fetches data and the user navigates away or the parameters change before the fetch completes, you can get stale responses. Always use a \`cancelled\` flag or AbortController.

**Common Patterns:**
1. **Fetch on mount** — Load initial data
2. **Fetch on prop change** — Re-fetch when parameters change
3. **Fetch on user action** — Load on button click
4. **Polling** — Re-fetch at intervals

**Pro tip:**
For production apps, consider using TanStack Query (React Query). It handles caching, deduplication, background refetching, pagination, and more — all the things you'd eventually need to build yourself.`,
    codeExample: `import { useState, useEffect } from 'react';

interface User { id: number; name: string; email: string; }

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/users', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        // Ignore aborted requests
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    // Cleanup: abort fetch if component unmounts
    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}`,
    quiz: [
      { question: 'What three states should you track for data fetching?', options: ['start, middle, end', 'loading, error, data', 'pending, resolved, rejected', 'idle, active, done'], correctIndex: 1 },
      { question: 'How do you prevent race conditions in fetches?', options: ['Use setTimeout', 'Use AbortController or a cancelled flag', 'Use async/await', 'Disable the button'], correctIndex: 1 },
    ],
  },

  // Module 5: Advanced Patterns
  {
    id: '16-usememo-usecallback',
    module: 'Advanced Patterns',
    moduleIndex: 4,
    title: 'useMemo & useCallback',
    description: 'Optimize performance with memoization.',
    content: `**useMemo** caches a computed value. **useCallback** caches a function. Both prevent unnecessary re-computations or re-creations on every render.

**useMemo:**
\`const value = useMemo(() => computeExpensiveValue(a, b), [a, b]);\`
- Returns the cached value unless dependencies change
- Use for expensive calculations or to maintain referential equality of objects/arrays

**useCallback:**
\`const fn = useCallback(() => doSomething(a, b), [a, b]);\`
- Returns the same function reference unless dependencies change
- Useful when passing callbacks to memoized child components

**When to use:**
- Expensive computations (sorting, filtering large lists)
- Referential equality matters (objects/arrays as props, dependencies of useEffect)
- Passing callbacks to memoized children

**When NOT to use:**
- Simple calculations (the memoization overhead costs more than the computation)
- For every function or value (premature optimization)
- If the component re-renders anyway (memoization doesn't help)

**Rule of thumb:** Profile first, optimize second. Most components don't need memoization.`,
    codeExample: `import { useState, useMemo, useCallback, memo } from 'react';

// useMemo: cache expensive computation
function SearchResults({ items, query }: {
  items: string[];
  query: string;
}) {
  // Only re-filters when items or query changes
  const filtered = useMemo(
    () => items.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    ),
    [items, query]
  );

  return (
    <ul>
      {filtered.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

// useCallback: stable function reference for memoized children
const ExpensiveChild = memo(({ onClick, label }: {
  onClick: () => void;
  label: string;
}) => {
  console.log('Child rendered');
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Without useCallback, this creates a new function every render
  // which would break memo's shallow comparison
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveChild onClick={handleClick} label="Click me" />
      <p>Count: {count}</p>
    </div>
  );
}`,
    quiz: [
      { question: 'What does useMemo cache?', options: ['A function', 'A computed value', 'A component', 'State'], correctIndex: 1 },
      { question: 'When should you use memoization?', options: ['Always', 'Only when profiling shows a performance issue', 'Never', 'Only in class components'], correctIndex: 1 },
    ],
  },
  {
    id: '17-react-memo',
    module: 'Advanced Patterns',
    moduleIndex: 4,
    title: 'React.memo',
    description: 'Prevent unnecessary component re-renders.',
    content: `**React.memo** is a higher-order component that memoizes the entire component. If its props haven't changed, it skips re-rendering and returns the last rendered output.

\`const MemoComponent = React.memo(Component);\`

**How it works:**
1. React compares previous props with next props using shallow equality
2. If all props are the same, it reuses the last render
3. If any prop changed, it re-renders

**Custom comparison:**
Pass a second argument for deep comparison:
\`React.memo(Component, (prev, next) => prev.id === next.id)\`

**When to use React.memo:**
- The component re-renders often with the same props
- The component is expensive to render
- The component is a pure function of its props

**When NOT to use:**
- The component is cheap to render (memo overhead > render cost)
- Props always change (memo never helps)
- The component has side effects that should run on every render

**Common pitfall:**
Passing new object/array/function references as props defeats memo. Use useMemo and useCallback to stabilize these references.`,
    codeExample: `import { memo, useState } from 'react';

// Without memo, this re-renders every time parent re-renders
// even though its props never change
const ExpensiveList = memo(function ExpensiveList({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (item: string) => void;
}) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item} onClick={() => onSelect(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
});

function App() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');

  const items = ['React', 'Vue', 'Angular', 'Svelte'];

  // This function is recreated every render,
  // which would break memo — use useCallback
  const handleSelect = (item: string) => setSelected(item);

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <ExpensiveList items={items} onSelect={handleSelect} />
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}`,
    quiz: [
      { question: 'What does React.memo do?', options: ['Caches state', 'Skips re-render if props are unchanged', 'Adds memoization to hooks', 'Prevents all re-renders'], correctIndex: 1 },
      { question: 'What defeats React.memo?', options: ['Using TypeScript', 'New object/array/function references as props', 'Using useState', 'Having children'], correctIndex: 1 },
    ],
  },
  {
    id: '18-error-boundaries',
    module: 'Advanced Patterns',
    moduleIndex: 4,
    title: 'Error Boundaries',
    description: 'Catch and handle rendering errors gracefully.',
    content: `**Error boundaries** are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI.

**Important: Error boundaries must be class components.** There is no hook equivalent (yet).

**When errors are caught:**
- Rendering
- Lifecycle methods
- Constructors of child components

**When errors are NOT caught:**
- Event handlers (use try/catch)
- Async code (use try/catch)
- Server-side rendering
- Errors in the error boundary itself

**Key methods:**
- \`static getDerivedStateFromError(error)\` — Update state to show fallback UI
- \`componentDidCatch(error, info)\` — Log the error (side effect)

**Best practices:**
- Place error boundaries around specific sections, not the entire app
- Provide meaningful fallback UIs
- Log errors to a monitoring service
- You can nest error boundaries for granular error handling`,
    codeExample: `import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage: wrap risky components
function App() {
  return (
    <ErrorBoundary fallback={<p>Widget failed to load</p>}>
      <RiskyWidget />
    </ErrorBoundary>
  );
}`,
    quiz: [
      { question: 'What type of component must an error boundary be?', options: ['Function component', 'Class component', 'Custom hook', 'HOC'], correctIndex: 1 },
      { question: 'Do error boundaries catch errors in event handlers?', options: ['Yes', 'No, use try/catch for those', 'Only click events', 'Only async events'], correctIndex: 1 },
    ],
  },
  {
    id: '19-portals-refs',
    module: 'Advanced Patterns',
    moduleIndex: 4,
    title: 'Portals & Refs',
    description: 'Escape the DOM hierarchy and access DOM nodes.',
    content: `**Portals** let you render children into a DOM node outside the parent component's DOM hierarchy. **Refs** give you direct access to DOM nodes or React elements.

**Portals:**
Useful for modals, tooltips, and notifications that need to visually "break out" of their container (overflow: hidden, z-index issues).

\`ReactDOM.createPortal(children, domNode)\`

The portal content still participates in React's event system — events bubble as if the portal were in the tree, not the DOM.

**Refs:**
- **DOM refs**: \`const ref = useRef<HTMLDivElement>(null)\` — access the actual DOM node
- **Callback refs**: More control over when the ref attaches/detaches
- **Ref forwarding**: \`React.forwardRef\` lets parent components pass refs through to children

**When to use refs:**
- Focus management, text selection, media playback
- Measuring DOM elements (size, position)
- Integrating with non-React libraries
- Animations that need direct DOM access

**When NOT to use refs:**
- For anything that should trigger a re-render (use state instead)
- To "synchronize" state with the DOM (let React handle it)`,
    codeExample: `import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Portal: render modal outside the app root
function Modal({ children }: { children: React.ReactNode }) {
  const modalRoot = document.getElementById('modal-root')!;
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    modalRoot
  );
}

// Ref: auto-focus an input
function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="I auto-focus!" />;
}

// Ref: measure element size
function ResizableBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="resizable">
      <p>{size.width} x {size.height}</p>
    </div>
  );
}`,
    quiz: [
      { question: 'What problem do portals solve?', options: ['Slow rendering', 'Rendering outside the parent DOM hierarchy', 'State management', 'Type checking'], correctIndex: 1 },
      { question: 'When should you use refs instead of state?', options: ['For values that affect rendering', 'For DOM access and non-reactive values', 'Always', 'Never'], correctIndex: 1 },
    ],
  },
  {
    id: '20-next-steps',
    module: 'Advanced Patterns',
    moduleIndex: 4,
    title: 'Next Steps & Ecosystem',
    description: 'Where to go from here.',
    content: `You now know the core of React. Here's what to explore next to build production apps.

**Routing:**
- **React Router** — The standard for client-side routing. Define routes, navigate between pages, handle URL params.
- **TanStack Router** — Type-safe, modern alternative.

**State Management:**
- **Zustand** — Minimal, simple, no boilerplate. Great for most apps.
- **Jotai / Recoil** — Atomic state management. Bottom-up approach.
- **Redux Toolkit** — For large apps with complex state. Powerful but more setup.

**Data Fetching:**
- **TanStack Query** — Server state management. Caching, background refetching, pagination, optimistic updates. The standard for data fetching.

**Meta-frameworks:**
- **Next.js** — SSR, SSG, API routes, file-based routing. The most popular React framework.
- **Remix** — Web-standard approach, nested routing, progressive enhancement.
- **Astro** — Content-focused, ships zero JS by default.

**Testing:**
- **Vitest** — Fast unit testing
- **React Testing Library** — Test components as users interact with them
- **Playwright** — End-to-end browser testing

**Keep learning:**
- Read the [React docs](https://react.dev)
- Build projects — the best way to learn
- Read open-source React code
- Join the React community`,
    codeExample: `// Example: React Router setup
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

// Example: Zustand store
import { create } from 'zustand';

const useStore = create<{
  count: number;
  increment: () => void;
}>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}`,
    quiz: [
      { question: 'What is the most popular React meta-framework?', options: ['Angular', 'Next.js', 'Express', 'Django'], correctIndex: 1 },
      { question: 'What library is the standard for data fetching in React?', options: ['Axios', 'TanStack Query (React Query)', 'fetch', 'SuperAgent'], correctIndex: 1 },
    ],
  },
];
