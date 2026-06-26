import type { AddClassIntrf } from "../models/data.model";

export default function AddClass(props: AddClassIntrf) {
    return (
        <div className="flex justify-center items-center fixed inset-0 z-20 bg-[rgba(0,0,0,0.5)]">
            <form onSubmit={props.addNewClass} className="flex flex-col gap-2.5 p-2.5 bg-gray-800 rounded-md w-80">
                <div className="text-blue-300 font-medium text-[24px] text-center">Add New Classname</div>
                <input
                    type="text"
                    id="classname"
                    className="outline-0 border border-blue-300 text-blue-300 font-medium text-[12px] p-2 rounded-lg"
                    value={props.newClassName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => props.setNewClassName(event.target.value)}
                />
                <div className="grid grid-cols-2 gap-2.5">
                    <button
                        type="submit" 
                        className="cursor-pointer bg-blue-600 text-white font-medium text-[12px] p-2 rounded-lg"
                    >
                        Add
                    </button>
                    <button
                        type="button" 
                        className="cursor-pointer bg-red-600 text-white font-medium text-[12px] p-2 rounded-lg"
                        onClick={props.handleForm}
                    >
                        Close
                    </button>
                </div>
                {props.error ? <div className="text-red-300 font-medium text-[24px] text-center">{props.error}</div> : null}
            </form>
        </div>
    );
}