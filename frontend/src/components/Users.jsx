import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  // Replace with backend call
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8000/api/v1/user/bulk?filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        } else {
          console.error("User data not found in the response.");
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => <User key={user._id} user={user} />)
        )}
      </div>
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between p-2 border-b">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl text-center">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button
          onClick={(e) => {
            navigate(`/send?id=${user._id}&name=${user.firstName}`);
          }}
          label="Send Money"
        />
      </div>
    </div>
  );
}
