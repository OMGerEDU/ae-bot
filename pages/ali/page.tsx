// pages/index.tsx
export default function Home() {
    return (
        <main style={{fontFamily:'sans-serif',padding:'2rem'}}>
            <h1>AE Affiliate Bot API</h1>
            <p>POST <code>/api/link</code> with&nbsp;{"{ url }"} to get a PID-tagged link.</p>
        </main>
    );
}
