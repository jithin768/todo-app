"use client";

import { logoutAction } from "@/lib/actions";
import { useState, useRef, useEffect } from "react";

type Priority = "low" | "medium" | "high";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
}

const PRIORITY_STYLES: Record<Priority, { badge: string; dot: string }> = {
  low:    { badge: "bg-slate-500/20 text-slate-400 border-slate-500/30",  dot: "bg-slate-400" },
  medium: { badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",   dot: "bg-amber-400" },
  high:   { badge: "bg-red-500/20   text-red-400   border-red-500/30",    dot: "bg-red-400"   },
};

export default function TodoClient({ username }: { username: string }) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Review project requirements", completed: true,  priority: "high",   createdAt: new Date() },
    { id: "2", text: "Design the database schema",  completed: false, priority: "medium", createdAt: new Date() },
    { id: "3", text: "Write unit tests",             completed: false, priority: "low",    createdAt: new Date() },
  ]);
  const [input, setInput]       = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter]     = useState<"all" | "active" | "completed">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [
      { id: crypto.randomUUID(), text, completed: false, priority, createdAt: new Date() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  const filtered = todos.filter(t =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  const activeCnt    = todos.filter(t => !t.completed).length;
  const completedCnt = todos.filter(t =>  t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">TodoApp</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm hidden sm:block">
              👋 {username}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total",     value: todos.length,  color: "text-indigo-400" },
            { label: "Active",    value: activeCnt,     color: "text-amber-400"  },
            { label: "Completed", value: completedCnt,  color: "text-emerald-400"},
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add todo */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex gap-2 mb-3">
            {(["low", "medium", "high"] as Priority[]).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all ${
                  priority === p
                    ? PRIORITY_STYLES[p].badge + " scale-105"
                    : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_STYLES[p].dot}`} />
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTodo()}
              placeholder="Add a new task…"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
            />
            <button
              onClick={addTodo}
              disabled={!input.trim()}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {(["all", "active", "completed"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {completedCnt > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>

        {/* Todo list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-600">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No tasks here</p>
            </div>
          )}

          {filtered.map(todo => (
            <div
              key={todo.id}
              className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
                todo.completed
                  ? "bg-white/3 border-white/5 opacity-60"
                  : "bg-white/5 border-white/10 hover:border-indigo-500/40"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-600 hover:border-indigo-400"
                }`}
              >
                {todo.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span className={`flex-1 text-sm ${todo.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                {todo.text}
              </span>

              {/* Priority badge */}
              <span className={`hidden sm:flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border capitalize ${PRIORITY_STYLES[todo.priority].badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_STYLES[todo.priority].dot}`} />
                {todo.priority}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
