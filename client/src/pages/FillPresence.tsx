import { useState } from "react";
import PresenceServices from "../services/presence.service";
import StudentNavbar from "../components/StudentNavbar";

export default function FillPresence() {
    const [studentStatus, setStudentStatus] = useState<{ [key: string]: string }>({});
    
    const { 
        allAvailablePresences,
        fillPresenceMt,
    } = PresenceServices();

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 font-mono">
            <div className="flex flex-col gap-3 h-full md:w-3/4 w-full bg-white p-2.5">
                <div className="text-2xl font-bold mb-6">Available Class Presences</div>
                <div className="grid gap-4">
                    {allAvailablePresences.availableFlatennedData.map((available_form) => {
                        const isExpired = new Date() > new Date(available_form.deadline);
                        
                        return (
                            <div key={available_form._id} className="p-4 border border-gray-600 rounded-lg bg-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-blue-400">{available_form.classname}</h3>
                                    <p className="text-sm text-gray-400">Opened: {new Date(available_form.start_time).toLocaleString()}</p>
                                    <p className="text-sm text-red-400 font-medium">Deadline: {new Date(available_form.deadline).toLocaleString()}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select 
                                        disabled={isExpired || fillPresenceMt.isPending}
                                        value={studentStatus[available_form._id] || ""}
                                        onChange={(e) => setStudentStatus({ ...studentStatus, [available_form._id]: e.target.value })}
                                        className="bg-gray-800 text-white border border-gray-600 p-2 rounded outline-none"
                                    >
                                        <option value="">-- Choose Status --</option>
                                        <option value="Present">Present</option> 
                                        <option value="Excused">Excused</option>
                                        <option value="Unexcused">Unexcused</option>
                                        <option value="Sick">Sick</option>
                                    </select>

                                    <button
                                        disabled={isExpired || !studentStatus[available_form._id] || fillPresenceMt.isPending}
                                        onClick={() => fillPresenceMt.mutate({
                                            presence_slot_id: available_form._id,
                                            student_status: studentStatus[available_form._id]
                                        })}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-semibold transition-colors"
                                    >
                                        {isExpired ? "Closed" : "Submit Absent"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {StudentNavbar(fillPresenceMt.isPending)}
        </section>
    );
}