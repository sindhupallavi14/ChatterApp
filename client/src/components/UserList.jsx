import { ListGroup, Badge } from "react-bootstrap";

export default function UserList({ users = [] }) {
  return (
    <div>
      <h6>Connected Users {users.length}</h6>
      <ListGroup>
        {users.map((u, index) => (
          <ListGroup.Item key={index}>
            <Badge bg={u.online ? "success" : "danger"} className="me-1">
              ●
            </Badge>
            {u.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
