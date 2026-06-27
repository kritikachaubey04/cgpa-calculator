import { useState } from 'react'
import jsPDF from 'jspdf'
import '../styles/calculator.css'

function CGPACalculator() {
  const [subjects, setSubjects] = useState([])
  const [name, setName] = useState('')
  const [credits, setCredits] = useState('')
  const [marks, setMarks] = useState('')
  const [result, setResult] = useState(null)

  const addSubject = () => {
    if (!name || !credits || !marks) return
    setSubjects([...subjects, {
      name,
      credits: parseFloat(credits),
      marks: parseFloat(marks)
    }])
    setName('')
    setCredits('')
    setMarks('')
  }

  const calculate = () => {
    if (subjects.length === 0) return
    let totalCredits = 0
    let weightedSum = 0

    subjects.forEach(sub => {
      const gradePoint = marksToGradePoint(sub.marks)
      weightedSum += gradePoint * sub.credits
      totalCredits += sub.credits
    })

    const cgpa = (weightedSum / totalCredits).toFixed(2)
    const percentage = (cgpa * 9.5).toFixed(2)
    const grade = cgpaToGrade(cgpa)

    setResult({ cgpa, percentage, grade, totalCredits })
  }

  const marksToGradePoint = (marks) => {
    if (marks >= 90) return 10
    if (marks >= 80) return 9
    if (marks >= 70) return 8
    if (marks >= 60) return 7
    if (marks >= 50) return 6
    if (marks >= 40) return 5
    return 0
  }

  const cgpaToGrade = (cgpa) => {
    if (cgpa >= 9) return 'O (Outstanding)'
    if (cgpa >= 8) return 'A+'
    if (cgpa >= 7) return 'A'
    if (cgpa >= 6) return 'B+'
    if (cgpa >= 5) return 'B'
    return 'F'
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('CGPA Result', 20, 20)
    doc.setFontSize(12)
    subjects.forEach((sub, i) => {
      doc.text(`${sub.name}: ${sub.marks} marks, ${sub.credits} credits`, 20, 40 + i * 10)
    })
    doc.text(`CGPA: ${result.cgpa}`, 20, 40 + subjects.length * 10 + 10)
    doc.text(`Percentage: ${result.percentage}%`, 20, 40 + subjects.length * 10 + 20)
    doc.text(`Grade: ${result.grade}`, 20, 40 + subjects.length * 10 + 30)
    doc.save('cgpa-result.pdf')
  }

  const reset = () => {
    setSubjects([])
    setResult(null)
  }

  return (
    <div className="container">
      <h1>📊 CGPA / Marks Calculator</h1>
      <p className="subtitle">Calculate your semester CGPA instantly</p>

      <div className="form-box">
        <input placeholder="Subject Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Marks (out of 100)" type="number" value={marks} onChange={e => setMarks(e.target.value)} />
        <input placeholder="Credits" type="number" value={credits} onChange={e => setCredits(e.target.value)} />
        <button className="btn-add" onClick={addSubject}>+ Add Subject</button>
      </div>

      {subjects.length > 0 && (
        <table>
          <thead>
            <tr><th>Subject</th><th>Marks</th><th>Credits</th><th>Grade Point</th></tr>
          </thead>
          <tbody>
            {subjects.map((sub, i) => (
              <tr key={i}>
                <td>{sub.name}</td>
                <td>{sub.marks}</td>
                <td>{sub.credits}</td>
                <td>{marksToGradePoint(sub.marks)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="btn-row">
        <button className="btn-calc" onClick={calculate}>Calculate CGPA</button>
        <button className="btn-reset" onClick={reset}>Reset</button>
      </div>

      {result && (
        <div className="result-box">
          <h2>Your Result</h2>
          <p>🎓 CGPA: <strong>{result.cgpa}</strong></p>
          <p>📈 Percentage: <strong>{result.percentage}%</strong></p>
          <p>🏅 Grade: <strong>{result.grade}</strong></p>
          <p>📚 Total Credits: <strong>{result.totalCredits}</strong></p>
          <button className="btn-pdf" onClick={downloadPDF}>⬇ Download PDF</button>
        </div>
      )}

      <footer>
        <p>Kritika Chaubey | kritikachaubey04@gmail.com</p>
        <a href="https://digitalheroesco.com" target="_blank" rel="noreferrer">
          <button className="btn-dh">Built for Digital Heroes</button>
        </a>
      </footer>
    </div>
  )
}

export default CGPACalculator