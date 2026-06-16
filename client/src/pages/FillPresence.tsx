export default function FillPresence() {
    // const queryClient = useQueryClient();
    // const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});

    // // 1. Ambil data form presensi yang tersedia untuk kelas student ini
    // const { data: availableForms, isLoading, error } = useQuery<PresenceSlot[]>({
    //     queryKey: ["available-presences"],
    //     queryFn: async () => {
    //         const res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/presence/student/available`, { withCredentials: true });
    //         return res.data;
    //     }
    // });

    // // 2. Mutasi untuk mengirimkan absensi siswa ke backend (fillPresenceForStudent)
    // const submitPresenceMutation = useMutation({
    //     mutationFn: async (payload: { slot_id: string; status: string }) => {
    //         const res = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/presence/student/fill`, payload, { withCredentials: true });
    //         return res.data;
    //     },
    //     onSuccess: (data) => {
    //         alert(data.message || "Presence successfully recorded!");
    //         queryClient.invalidateQueries({ queryKey: ["available-presences"] });
    //     },
    //     onError: (err: any) => {
    //         alert(err.response?.data?.message || "Failed to submit presence");
    //     }
    // });

    // if (isLoading) return <p className="text-white">Loading presences...</p>;
    // if (error) return <p className="text-red-400">No presence form available for your class right now.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto text-white">
            <h1 className="text-2xl font-bold mb-6">Available Class Presences</h1>
            {/* <div className="grid gap-4">
                {availableForms?.map((form) => {
                    const isExpired = new Date() > new Date(form.deadline);
                    
                    return (
                        <div key={form._id} className="p-4 border border-gray-600 rounded-lg bg-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-lg text-blue-400">{form.classname}</h3>
                                <p className="text-sm text-gray-400">Opened: {new Date(form.start_time).toLocaleString()}</p>
                                <p className="text-sm text-red-400 font-medium">Deadline: {new Date(form.deadline).toLocaleString()}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <select 
                                    disabled={isExpired || submitPresenceMutation.isPending}
                                    value={selectedStatus[form._id] || ""}
                                    onChange={(e) => setSelectedStatus({ ...selectedStatus, [form._id]: e.target.value })}
                                    className="bg-gray-800 text-white border border-gray-600 p-2 rounded outline-none"
                                >
                                    <option value="">-- Choose Status --</option>
                                    <option value="Hadir">Hadir</option>
                                    <option value="Izin">Izin</option>
                                    <option value="Sakit">Sakit</option>
                                </select>

                                <button
                                    disabled={isExpired || !selectedStatus[form._id] || submitPresenceMutation.isPending}
                                    onClick={() => submitPresenceMutation.mutate({
                                        slot_id: form._id,
                                        status: selectedStatus[form._id]
                                    })}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-semibold transition-colors"
                                >
                                    {isExpired ? "Closed" : "Submit Absent"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div> */}
        </div>
    );
}