import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalForm = ({ show, onHide, onSave, title, fields, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field) => (
            <Form.Group className="mb-3" key={field.id}>
              <Form.Label>{field.label}</Form.Label>
              {field.type === 'select' ? (
                <Form.Select id={field.id} value={formData[field.id] || ''} onChange={handleChange}>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type={field.type || 'text'}
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={handleChange}
                  required={field.required}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
        <Button variant="primary" onClick={() => onSave(formData)}>Lưu</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalForm;