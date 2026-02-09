import { Link } from "react-router-dom";

export default function CourseCard({ course, trainer }) {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} />

      <h3>{course.title}</h3>
      <p>{course.description}</p>

      <div className="card-actions">
        {!trainer && (
          <>
            <button className="outline-btn">Syllabus</button>
            <Link className="solid-btn" to={`/course/${course.id}`}>
              Know More
            </Link>
          </>
        )}

        {trainer && (
          <>
            <Link to={`/trainer/add-levels/${course.id}`} className="link-btn">
              Add Levels
            </Link>
            <button className="delete-btn">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
