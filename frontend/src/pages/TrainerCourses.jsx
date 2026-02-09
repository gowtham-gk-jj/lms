import TrainerSidebar from "../components/TrainerSidebar";
import "./TrainerCourses.css";

const dummyCourses = [
  {
    id: 1,
    title: "Data Analytics",
    desc: "raw data using tools and techniques",
    image: "/images/data.jpg"
  },
  {
    id: 2,
    title: "Full Stack Development",
    desc: "MERN stack with projects",
    image: "/images/fullstack.jpg"
  },
  {
    id: 3,
    title: "Python Programming",
    desc: "Python from Basics to Advanced",
    image: "/images/python.jpg"
  },
  {
    id: 4,
    title: "Java Programming",
    desc: "Core Java to Advanced Concepts",
    image: "/images/java.jpg"
  }
];

export default function TrainerCourses() {
  return (
    <div className="trainer-layout">
      <TrainerSidebar />

      <main className="trainer-content">
        <h2>Your Courses</h2>

        <div className="course-grid">
          {dummyCourses.map(course => (
            <div className="course-card" key={course.id}>
              <img src={course.image} alt={course.title} />

              <h3>{course.title}</h3>
              <p>{course.desc}</p>

              <div className="course-actions">
                <button className="link-btn">Add Levels</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
