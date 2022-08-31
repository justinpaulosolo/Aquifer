import React, { useState } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import JobsScheduleService from '../../services/jobScheduleService';
import toastr from 'toastr';

const AddEditEvent = ({
    isOpen,
    onClose,
    isEditable,
    onRemoveJobSchedule,
    onUpdateJobSchedule,
    onAddJobSchedule,
    jobScheduleData,
    orgInfo,
}) => {
    const [event] = useState(jobScheduleData);
    const [jobInfo, setJobInfo] = useState();
    const [orgSelectInfo, setOrgSelectInfo] = useState();

    const onSubmitEvent = (data) => {
        isEditable ? onUpdateJobSchedule(data) : onAddJobSchedule({ ...data, orgSelectInfo });
    };

    const handleChange = (args) => {
        const id = args.target.value;
        setOrgSelectInfo(id);
        JobsScheduleService.getJobByOrgId(id).then(onGetJobByOrgIdSuccess).catch(onGetJobByOrgIdError);
    };
    const onGetJobByOrgIdSuccess = (response) => {
        setJobInfo(response.items.map(mapJobInfo));
    };

    const onGetJobByOrgIdError = () => {
        toastr.warning('Please select Organization with Job');
    };

    const mapJobInfo = (args, index) => {
        return (
            <option key={`select_opt_job_${index}`} value={args.id}>
                {args.title}
            </option>
        );
    };

    return (
        <Modal show={isOpen} onHide={onClose} backdrop="static" keyboard={false}>
            <Modal.Header className="pb-2 px-4 border-bottom-0" closeButton>
                <Modal.Title id="modal-title">
                    <h5> {isEditable ? 'Edit Job Schedule' : 'Add New Job Schedule'} </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 pb-4 pt-0">
                <Formik initialValues={event} enableReinitialize={true} onSubmit={onSubmitEvent}>
                    {({ values }) => (
                        <Form>
                            <Row>
                                {!isEditable && (
                                    <>
                                        <Col sm={12}>
                                            <label htmlFor="orgId">Select The Organization</label>
                                            <Field
                                                as="select"
                                                name="orgId"
                                                value={values.OrgId}
                                                onChange={handleChange}
                                                className="form-control">
                                                <option value="">Select Organization</option>
                                                {orgInfo}
                                            </Field>
                                        </Col>
                                        <Col sm={12} className="mt-2">
                                            <label htmlFor="job">Select The Job</label>
                                            <Field as="select" name="job" value={values.JobId} className="form-control">
                                                <option value="">Select Job</option>
                                                {jobInfo}
                                            </Field>
                                        </Col>
                                    </>
                                )}
                                <Col className="mt-2">
                                    <>
                                        <label htmlFor="StartDate">Start Date</label>
                                        <Field
                                            type="date"
                                            name="StartDate"
                                            value={values.StartDate}
                                            className="form-control"
                                        />
                                    </>
                                </Col>
                                <Col className="mt-2">
                                    <>
                                        <label htmlFor="EndDate">End Date</label>
                                        <Field
                                            type="date"
                                            name="EndDate"
                                            value={values.EndDate}
                                            className="form-control"
                                        />
                                    </>
                                </Col>
                                <Col className="mt-2">
                                    <label htmlFor="startTime">Start Time</label>
                                    <Field
                                        type="time"
                                        name="startTime"
                                        value={values.DailyStartTime}
                                        className="form-control"
                                    />
                                </Col>
                                <Col className="mt-2">
                                    <label htmlFor="endTime">End Time</label>
                                    <Field
                                        type="time"
                                        name="endTime"
                                        value={values.DailyEndTime}
                                        className="form-control"
                                    />
                                </Col>
                            </Row>

                            <Row className="mt-2">
                                <Col xs={4}>
                                    {isEditable ? (
                                        <Button variant="danger" onClick={onRemoveJobSchedule}>
                                            Delete
                                        </Button>
                                    ) : null}
                                </Col>
                                <Col xs={8} className="text-end">
                                    <Button className="btn btn-light me-1" onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button variant="success" type="submit" className="btn btn-success">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

AddEditEvent.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isEditable: PropTypes.bool.isRequired,
    jobScheduleData: PropTypes.shape({}),
    onRemoveJobSchedule: PropTypes.func,
    onUpdateJobSchedule: PropTypes.func,
    onAddJobSchedule: PropTypes.func,
    orgInfo: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    jobInfo: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    jobScheduleEntyData: PropTypes.shape({
        ScheduleId: PropTypes.number.isRequired,
        StartDate: PropTypes.string.isRequired,
        EndDate: PropTypes.string.isRequired,
        DailyStartTime: PropTypes.string.isRequired,
        DailyEndTime: PropTypes.string.isRequired,
        JobId: PropTypes.number.isRequired,
    }),
};

export default AddEditEvent;
