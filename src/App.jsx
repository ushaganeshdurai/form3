import React, { useState } from 'react';
import './index.css'; // Import CSS file for styling
import mockQuestions from './mock/mockQuestions.json'; // Import mock data
import { z } from 'zod';

// Define Zod schema for form validation
const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  surveyTopic: z.enum(["Technology", "Health", "Education"], "Select a valid survey topic"),
  favoriteLanguage: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  exerciseFrequency: z.string().optional(),
  dietPreference: z.string().optional(),
  highestQualification: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  feedback: z.string().min(1, "Feedback is required")
});

const App = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [surveyTopic, setSurveyTopic] = useState('');
  const [favoriteLanguage, setFavoriteLanguage] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [dietPreference, setDietPreference] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [feedback, setFeedback] = useState('');
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectedData, setCollectedData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName,
      email,
      surveyTopic,
      favoriteLanguage,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      exerciseFrequency,
      dietPreference,
      highestQualification,
      fieldOfStudy,
      feedback
    };

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors);
      return;
    }

    try {
      const fetchedQuestions = await fetchAdditionalQuestions(surveyTopic);
      setAdditionalQuestions(fetchedQuestions);
      console.log('Additional questions fetched:', fetchedQuestions);

      // Store collected data and open the modal
      setCollectedData(formData);
      setIsModalOpen(true);

      // Handle form submission or other logic here
    } catch (error) {
      console.error('Error fetching additional questions:', error);
      // Handle error state or display appropriate message
    }
  };

  const fetchAdditionalQuestions = async (surveyTopic) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const questions = mockQuestions[surveyTopic] || [];
        resolve(questions);
      }, 500); // Simulate delay of 500ms
    });
  };

  const renderAdditionalQuestions = () => {
    return additionalQuestions.map((question, index) => (
      <div key={index} className="question-container">
        <p>{question.text}</p>
        {/* Example: Render appropriate input fields based on question type */}
        {/* Example: <input type="text" /> or <select>...</select> */}
      </div>
    ));
  };

  const renderCollectedData = () => {
    return Object.entries(collectedData).map(([key, value], index) => (
      <tr key={index}>
        <td className="modal-key">{key}</td>
        <td className="modal-value">{value}</td>
      </tr>
    ));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        {errors.fullName && <p className="error">{errors.fullName._errors[0]}</p>}
        <br /><br />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error">{errors.email._errors[0]}</p>}
        <br /><br />

        <label htmlFor="surveyTopic">Survey Topic:</label>
        <select
          id="surveyTopic"
          value={surveyTopic}
          onChange={(e) => setSurveyTopic(e.target.value)}
          required
        >
          <option value="">Select...</option>
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
        </select>
        {errors.surveyTopic && <p className="error">{errors.surveyTopic._errors[0]}</p>}
        <br /><br />

        {surveyTopic === 'Technology' && (
          <>
            <label htmlFor="favoriteLanguage">Favorite Programming Language:</label>
            <select
              id="favoriteLanguage"
              value={favoriteLanguage}
              onChange={(e) => setFavoriteLanguage(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
            </select>
            {errors.favoriteLanguage && <p className="error">{errors.favoriteLanguage._errors[0]}</p>}
            <br /><br />

            <label htmlFor="yearsOfExperience">Years of Experience:</label>
            <input
              type="number"
              id="yearsOfExperience"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              required
            />
            {errors.yearsOfExperience && <p className="error">{errors.yearsOfExperience._errors[0]}</p>}
            <br /><br />
          </>
        )}

        {surveyTopic === 'Health' && (
          <>
            <label htmlFor="exerciseFrequency">Exercise Frequency:</label>
            <select
              id="exerciseFrequency"
              value={exerciseFrequency}
              onChange={(e) => setExerciseFrequency(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Rarely">Rarely</option>
            </select>
            {errors.exerciseFrequency && <p className="error">{errors.exerciseFrequency._errors[0]}</p>}
            <br /><br />

            <label htmlFor="dietPreference">Diet Preference:</label>
            <select
              id="dietPreference"
              value={dietPreference}
              onChange={(e) => setDietPreference(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
            {errors.dietPreference && <p className="error">{errors.dietPreference._errors[0]}</p>}
            <br /><br />
          </>
        )}

        {surveyTopic === 'Education' && (
          <>
            <label htmlFor="highestQualification">Highest Qualification:</label>
            <select
              id="highestQualification"
              value={highestQualification}
              onChange={(e) => setHighestQualification(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
            {errors.highestQualification && <p className="error">{errors.highestQualification._errors[0]}</p>}
            <br /><br />

            <label htmlFor="fieldOfStudy">Field of Study:</label>
            <input
              type="text"
              id="fieldOfStudy"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              required
            />
            {errors.fieldOfStudy && <p className="error">{errors.fieldOfStudy._errors[0]}</p>}
            <br /><br />
          </>
        )}

        <label htmlFor="feedback">Feedback:</label><br />
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>
        {errors.feedback && <p className="error">{errors.feedback._errors[0]}</p>}
        <br /><br />

        {additionalQuestions.length > 0 && (
          <>
            <h2>Additional Questions:</h2>
            {renderAdditionalQuestions()}
          </>
        )}

        <button type="submit">Submit</button>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Collected Data</h2>
            <table className="modal-table">
              <tbody>
                {renderCollectedData()}
              </tbody>
            </table>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
