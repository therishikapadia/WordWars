import React, { useEffect, useState } from 'react'
import Navbar from '../Common/Navbar'
import '../../Font.css'
import axios from "axios";

function LeaderBoard({ isAuthenticated, apiUrl }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${apiUrl}/leaderboard/top10`)
            .then(response => {
                setTimeout(() => {
                    setData(response.data);
                    setLoading(false);
                }, 2000);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
                setLoading(false);
            });
    }, [apiUrl]);

    console.log(data)
    if (error) return <p>{error}</p>;
    return (
        <div className='__className_ea5f4b antialiased min-h-screen bg-gradient-to-b from-neutral-900 to-black text-neutral-400'>
            <Navbar isAuthenticated={isAuthenticated} />
            <div
                className="w-full max-w-5xl mx-auto space-y-8 pb-8 px-4 sm:px-6 lg:px-8 mt-7"
            >
                <div style={{ transform: "translateY(20px)" }}>
                    <div className="rounded-xl border text-card-foreground bg-neutral-900/50 border-neutral-800 shadow-lg">
                        <div className="flex flex-col space-y-1.5 p-6 pb-2">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <div className="font-semibold geist-mono-latin-600 tracking-tight text-xl sm:text-2xl flex items-center space-x-3 text-neutral-200">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-crown size-6 sm:size-8 text-yellow-400"
                                    >
                                        <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                                        <path d="M5 21h14" />
                                    </svg>
                                    <span>Leaderboard</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="flex geist-mono-latin-400 h-9 rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-neutral-800 border-neutral-700 text-gray-100 w-full"
                                        placeholder="Search by name..."
                                        defaultValue=""
                                    />
                                </div>
                                {loading ? (<div className="overflow-x-auto">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-loader-pinwheel animate-spin mx-auto size-10 text-yellow-400"
                                    >
                                        <path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" />
                                        <path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
                                        <path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
                                        <circle cx={12} cy={12} r={10} />
                                    </svg>
                                </div>) : <></>}
                            </div>
                            <div className="overflow-x-auto">
                                <div
                                    dir="ltr"
                                    className="relative overflow-hidden h-[300px] pr-4"
                                    style={{
                                        position: "relative",
                                        "--radix-scroll-area-corner-width": "0px",
                                        "--radix-scroll-area-corner-height": "0px",
                                    }}
                                >
                                    <style
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                "[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}",
                                        }}
                                    />
                                    <div
                                        data-radix-scroll-area-viewport
                                        className="h-full w-full rounded-[inherit]"
                                        style={{ overflow: "hidden scroll" }}
                                    >
                                        <div style={{ "minWidth": "100%", display: "table" }}>
                                            <div className="relative w-full overflow-auto">
                                                <table className="w-full caption-bottom text-sm">
                                                    <thead className="[&_tr]:border-b">
                                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                            <th className="h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300">
                                                                Rank
                                                            </th>
                                                            <th className="h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300">
                                                                Name
                                                            </th>
                                                            <th className="h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300">
                                                                WPM
                                                            </th>
                                                            <th className="h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden sm:table-cell">
                                                                Accuracy
                                                            </th>
                                                            <th className="h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden md:table-cell">
                                                                Time
                                                            </th>
                                                            <th className="h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden lg:table-cell">
                                                                Mode
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="[&_tr:last-child]:border-0">
                                                        <tr className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-neutral-800/50">
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium text-gray-100">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={24}
                                                                    height={24}
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-medal size-4 sm:size-5 text-yellow-400"
                                                                >
                                                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
                                                                    <path d="M11 12 5.12 2.2" />
                                                                    <path d="m13 12 5.88-9.8" />
                                                                    <path d="M8 7h8" />
                                                                    <circle cx={12} cy={17} r={5} />
                                                                    <path d="M12 18v-2h-.5" />
                                                                </svg>
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-100">
                                                                Buriza
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-sky-400">
                                                                174
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-emerald-400 hidden sm:table-cell">
                                                                100%
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-violet-400 hidden md:table-cell">
                                                                4s
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden lg:table-cell">
                                                                words
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-neutral-800/50">
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium text-gray-100">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={24}
                                                                    height={24}
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-medal size-4 sm:size-5 text-gray-400"
                                                                >
                                                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
                                                                    <path d="M11 12 5.12 2.2" />
                                                                    <path d="m13 12 5.88-9.8" />
                                                                    <path d="M8 7h8" />
                                                                    <circle cx={12} cy={17} r={5} />
                                                                    <path d="M12 18v-2h-.5" />
                                                                </svg>
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-100">
                                                                Ritik Sahni
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-sky-400">
                                                                122
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-emerald-400 hidden sm:table-cell">
                                                                100%
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-violet-400 hidden md:table-cell">
                                                                6s
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden lg:table-cell">
                                                                words
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-neutral-800/50">
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium text-gray-100">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={24}
                                                                    height={24}
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-medal size-4 sm:size-5 text-amber-600"
                                                                >
                                                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
                                                                    <path d="M11 12 5.12 2.2" />
                                                                    <path d="m13 12 5.88-9.8" />
                                                                    <path d="M8 7h8" />
                                                                    <circle cx={12} cy={17} r={5} />
                                                                    <path d="M12 18v-2h-.5" />
                                                                </svg>
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-100">
                                                                Aayush Jaiswal
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-sky-400">
                                                                118
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-emerald-400 hidden sm:table-cell">
                                                                100%
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-violet-400 hidden md:table-cell">
                                                                5s
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden lg:table-cell">
                                                                words
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-neutral-800/50">
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium text-gray-100">
                                                                4
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-100">
                                                                Hemant
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-sky-400">
                                                                99
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-emerald-400 hidden sm:table-cell">
                                                                100%
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-violet-400 hidden md:table-cell">
                                                                7s
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden lg:table-cell">
                                                                words
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-neutral-800/50">
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium text-gray-100">
                                                                5
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-100">
                                                                jaydeep patil
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-sky-400">
                                                                98
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-emerald-400 hidden sm:table-cell">
                                                                100%
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-violet-400 hidden md:table-cell">
                                                                8s
                                                            </td>
                                                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-gray-300 hidden lg:table-cell">
                                                                words
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="flex justify-center"
                    style={{ transform: "translateY(20px)" }}
                >
                    <a
                        className="inline-flex text-white geist-mono-latin-600 items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground shadow bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-700 hover:to-emerald-800 font-semibold transition-all duration-300 h-10 rounded-md px-8 w-full sm:w-auto"
                        href="/type"
                    >
                        Start New Race
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-arrow-right ml-2"
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>

    )
}

export default LeaderBoard
