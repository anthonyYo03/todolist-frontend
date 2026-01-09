import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import BACKEND_URL from '../../config.js';
type DeleteUserTaskProps = {
  deleteTaskId: string;
  onDeleteSuccess: (id: string) => void;
};

const DeleteUserTask = ({ deleteTaskId, onDeleteSuccess }: DeleteUserTaskProps) => {
  const [show, setShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/tasks/${deleteTaskId}`, { withCredentials: true });
      toast.success('Task deleted successfully');
      setShow(false);
      onDeleteSuccess(deleteTaskId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShow(true)}>
        🗑️ Delete
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        backdrop="static" // dims background and prevents click outside to close
        keyboard={true} // allows Esc key to close
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this task?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)} disabled={isDeleting}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteUserTask;
