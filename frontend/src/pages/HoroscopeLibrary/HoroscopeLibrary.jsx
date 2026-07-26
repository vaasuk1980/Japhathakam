import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PersonService from "../../services/PersonService";

function HoroscopeLibrary() {

    const [requestState, setRequestState] = useState({
        status: "loading",
        persons: [],
        error: null,
    });

    const loadPersons = () => {

        setRequestState((previous) => ({
            ...previous,
            status: "loading",
            error: null,
        }));

        PersonService.list()
            .then((persons) => {
                setRequestState({ status: "success", persons, error: null });
            })
            .catch((error) => {
                console.error("Failed to load saved persons", error);
                setRequestState({ status: "error", persons: [], error: error.message });
            });

    };

    useEffect(() => {
        loadPersons();
    }, []);

    const handleDelete = async (person) => {

        const confirmed = window.confirm(
            `Delete ${person.firstName} ${person.lastName}'s saved birth record? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            await PersonService.remove(person.id);
            loadPersons();
        }
        catch (error) {
            console.error("Delete Error", error);
            window.alert(error.message);
        }

    };

    return (
        <div>

            <h1>Horoscope Library</h1>

            <p>
                <Link to="/person-details">+ New Person</Link>
            </p>

            {requestState.status === "loading" && (
                <div>Loading saved persons...</div>
            )}

            {requestState.status === "error" && (
                <div>{requestState.error}</div>
            )}

            {requestState.status === "success" && requestState.persons.length === 0 && (
                <div>No saved birth details yet.</div>
            )}

            {requestState.status === "success" && requestState.persons.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Time of Birth</th>
                            <th>Place of Birth</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestState.persons.map((person) => (
                            <tr key={person.id}>
                                <td>{person.firstName} {person.lastName}</td>
                                <td>{person.dateOfBirth}</td>
                                <td>{person.timeOfBirth}</td>
                                <td>{person.placeOfBirth}</td>
                                <td>
                                    <Link to={`/person-details?id=${person.id}`}>Edit</Link>
                                    {" | "}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(person)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default HoroscopeLibrary;
