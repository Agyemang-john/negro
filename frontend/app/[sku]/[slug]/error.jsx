"use client"
// app/[sku]/[slug]/error.js


export default function Error({ error, reset }) {
    return (
        <div>
            <h1>Error: {error.message}</h1>
            <button onClick={reset}>Retry</button>
        </div>
    );
}
