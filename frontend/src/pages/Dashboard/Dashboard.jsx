import "./Dashboard.css";

function Dashboard() {
  return (
    <main className="page">
      <h1 className="page-title">
        జాఫతకం Dashboard
      </h1>

      {[...Array(50)].map((_, index) => (
        <p
          key={index}
          className="body-md"
        >
          This is test line {index + 1}
        </p>
      ))}
    </main>
  );
}

export default Dashboard;