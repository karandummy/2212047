import React, { useState } from "react";

const MAX_URLS = 5;
const API_URL = "http://localhost:5000/shorturls";

function isValidUrl(url) {
  return /^https?:\/\/.+/.test(url);
}

function UrlShortenerPage() {
  const [inputs, setInputs] = useState([
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" }
  ]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const validateInputs = () => {
    const errs = inputs.map((input) => {
      if (!input.url) return "URL is required";
      if (!isValidUrl(input.url)) return "Invalid URL format";
      if (input.validity && isNaN(Number(input.validity))) return "Validity must be an integer";
      return "";
    });
    setErrors(errs);
    return errs.every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const promises = inputs
      .filter((input) => input.url)
      .map((input) =>
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: input.url,
            validity: input.validity ? Number(input.validity) : undefined,
            shortcode: input.shortcode || undefined
          })
        }).then((res) => res.json())
      );

    const resArr = await Promise.all(promises);
    setResults(resArr);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, idx) => (
          <div key={idx} style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
            <label>
              Original URL:
              <input
                type="text"
                value={input.url}
                onChange={(e) => handleChange(idx, "url", e.target.value)}
                style={{ width: "100%" }}
                
              />
            </label>
            <br />
            <label>
              Validity (seconds, optional):
              <input
                type="number"
                value={input.validity}
                onChange={(e) => handleChange(idx, "validity", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <br />
            <label>
              Preferred Shortcode (optional):
              <input
                type="text"
                value={input.shortcode}
                onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <br />
            {errors[idx] && <span style={{ color: "red" }}>{errors[idx]}</span>}
          </div>
        ))}
        <button type="submit">Shorten URLs</button>
      </form>
      <h3>Results</h3>
      <ul>
        {results.map((res, idx) => (
          <li key={idx}>
            <strong>Original:</strong> {inputs[idx].url} <br />
            <strong>Short Link:</strong>{" "}
            <a href={res.shortLink} target="_blank" rel="noopener noreferrer">
              {res.shortLink}
            </a>
            <br />
            <strong>Expiry:</strong> {res.expiry}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UrlShortenerPage;
