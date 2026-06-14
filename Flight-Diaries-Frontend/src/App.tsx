import { useEffect, useState } from "react";
import diaryService from "./services/diaryService";
import type { DiaryEntry, NewDiaryEntry, Weather, Visibility } from "./types";
import { Weather as WeatherOptions, Visibility as VisibilityOptions } from "./types";

function App() {

  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather | undefined>(undefined);
  const [visibility, setVisibility] = useState<Visibility | undefined>(undefined);



  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchDiaries = async () => {
      const diaryData = await diaryService.getAll();
      setDiaries(diaryData);
    };

    void fetchDiaries();
  }, []);

  const addDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!weather || !visibility) {
        setError('Please select weather and visibility');
        return;
      }

      const newDiary: NewDiaryEntry = {
        date,
        weather,
        visibility,
        comment,
      };



      const createdDiary = await diaryService.create(newDiary);

      setDiaries(diaries.concat(createdDiary));

      setDate("");
      setWeather(undefined);
      setVisibility(undefined);

      setComment("");
      setError("");

    } catch (error: unknown) {
      // diaryService.create already turns Axios/backend failures into a message
      setError(error instanceof Error ? error.message : "Failed to create diary entry");
    }
  };


  return (
    <div>
      <h1>Add New Entry</h1>

{error && (
  <div style={{ color: "red" }}>
    Error: {error}
  </div>
)}

    <form onSubmit={addDiary}>
  <div className="form-row">
    <label>Date</label>
    <input
      type="date"
      value={date}
      onChange={(e) =>
        setDate(e.target.value)
      }
    />
  </div>

  <div className="form-row">
    <label>Visibility</label>
    <div role="radiogroup" aria-label="Visibility">
      {Object.entries(VisibilityOptions).map(([key, value]) => (
        <label key={key} style={{ marginRight: 12 }}>
          <input
            type="radio"
            name="visibility"
            value={value}
            checked={visibility === value}
            onChange={() => setVisibility(value)}
          />
          {key}
        </label>
      ))}
    </div>
  </div>

  <div className="form-row">
    <label>Weather</label>
    <div role="radiogroup" aria-label="Weather">
      {Object.entries(WeatherOptions).map(([key, value]) => (
        <label key={key} style={{ marginRight: 12 }}>
          <input
            type="radio"
            name="weather"
            value={value}
            checked={weather === value}
            onChange={() => setWeather(value)}
          />
          {key}
        </label>
      ))}
    </div>
  </div>


  <div className="form-row">
    <label>Comment</label>
    <input
      value={comment}
      onChange={(e) =>
        setComment(e.target.value)
      }
    />
  </div>

  <button type="submit">
    Add Entry
  </button>
</form>

      <h1>Diary Entries</h1>
            
            <div className="diaries-container">
      {diaries.map((diary) => (
        <div key={diary.id}
         className="diary-card">

          <div className="diary-date">
        {diary.date}
      </div>

           <div className="diary-info">
        Visibility: {diary.visibility}
      </div>  

          <div className="diary-info">
        Weather: {diary.weather}
      </div>

          <br />
        </div>
      ))}
    </div>
    </div>
  );
}

export default App;