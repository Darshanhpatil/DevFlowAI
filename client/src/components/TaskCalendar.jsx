import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function TaskCalendar({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    return (
      new Date(task.dueDate).toDateString() ===
      selectedDate.toDateString()
    );
  });

  return (
    <div>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="premium-calendar"
      />

      <div className="mt-8">

        <h3 className="text-2xl font-bold mb-4">
          Tasks for{" "}
          {selectedDate.toDateString()}
        </h3>

        {selectedTasks.length === 0 ? (
          <div className="bg-slate-800 p-6 rounded-xl text-slate-400">
            No tasks scheduled
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">

            {selectedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-slate-800 border border-slate-700 p-5 rounded-2xl"
              >
                <h4 className="font-bold text-lg">
                  {task.title}
                </h4>

                <p className="text-slate-400 mt-2">
                  {task.description}
                </p>

                <span className="inline-block mt-3 bg-blue-600 px-3 py-1 rounded-full text-sm">
                  {task.status}
                </span>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default TaskCalendar;