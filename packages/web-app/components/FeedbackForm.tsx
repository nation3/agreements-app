import axios from "axios";
import { useState } from "react";

const FeedbackForm = () => {
	const [feedback, setFeedback] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const airtableURL = `https://api.airtable.com/v0/appMScHtlWGPuDAPC/Your_Table_Name`;
		const data = {
			fields: {
				Feedback: feedback,
			},
		};

		await axios.post(airtableURL, data, {
			headers: {
				Authorization: `Bearer patPW55qv88kGRPOy.6751bea2d3d6610f29d4cdbd8e6f44f5b2140ce7a8772a74dc44aa2e185abd12`,
				"Content-Type": "application/json",
			},
		});

		setFeedback("");
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				value={feedback}
				onChange={(e) => setFeedback(e.target.value)}
				placeholder="Leave your feedback here"
			/>
			<button type="submit">Submit</button>
		</form>
	);
};

export default FeedbackForm;
