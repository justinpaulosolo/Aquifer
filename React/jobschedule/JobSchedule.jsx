import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Form, Field, Formik } from 'formik';
import toastr from 'toastr';
import Calendar from './Calendar.jsx';
import AddEditEvent from './AddEditSchedule.jsx';
import JobScheduleService from '../../services/jobScheduleService';
import { GetAllOrganizations } from '../../services/organizationsService';
import '@fullcalendar/react';

const CalendarApp = () => {
    const [show, setShow] = useState(false);
    const onCloseModal = () => {
        setShow(false);
        setJobScheduleData({});
    };
    const onOpenModal = () => setShow(true);
    const [isEditable, setIsEditable] = useState(false);
    const [selectItems, setSelectItems] = useState(null);
    const [jobSchedules, setJobSchedules] = useState();
    const [orgInfo, setOrgInfo] = useState([]);
    const [jobScheduleData, setJobScheduleData] = useState({
        ScheduleId: 0,
        StartDate: '',
        EndDate: '',
        DailyStartTime: '',
        DailyEndTime: '',
        JobId: 0,
    });

    useEffect(() => {
        getAllSchedule();
        getOrganizations();
    }, []);

    const onDateClick = (arg) => {
        const event = {
            StartDate: arg.dateStr,
            EndDate: arg.dateStr,
        };
        setJobScheduleData(event);
        setIsEditable(false);
        onOpenModal();
    };

    const onJobScheduleClick = (arg) => {
        const event = {
            ScheduleId: arg.event.id,
            StartDate: arg.event._def.extendedProps.event.startDate.slice(0, -9),
            EndDate: arg.event._def.extendedProps.event.endDate.slice(0, -9),
            DailyStartTime: arg.event._def.extendedProps.event.dailyStartTime,
            DailyEndTime: arg.event._def.extendedProps.event.dailyEndTime,
            OrgId: arg.event._def.extendedProps.event.organizationId,
            JobId: arg.event._def.extendedProps.event.jobId,
        };
        setJobScheduleData(event);
        setIsEditable(true);
        onOpenModal();
    };

    const onAddJobSchedule = (data) => {
        let payload = {
            OrgId: data.orgSelectInfo,
            StartDate: data.StartDate,
            EndDate: data.EndDate,
            DailyStartTime: `${data.startTime}:00`,
            DailyEndTime: `${data.endTime}:00`,
            JobId: data.job,
        };
        addSchedule(payload);
        onCloseModal();
    };

    const onUpdateJobSchedule = (data) => {
        const payload = {
            StartDate: data.StartDate,
            EndDate: data.EndDate,
            DailyStartTime: data.DailyStartTime,
            DailyEndTime: data.DailyEndTime,
        };
        updateJobSchedule(data.ScheduleId, payload);
        onCloseModal();
    };

    const onRemoveJobSchedule = () => {
        deleteSchedule(jobScheduleData.ScheduleId);
        onCloseModal();
    };

    const handleSelectFilter = (e) => {
        const selected = e.target.value;
        getOrganizationsById(selected);
    };

    const updateJobSchedule = (id, payload) => {
        JobScheduleService.update(id, payload).then(onUpdateSuccess).catch(onUpdateError);
    };

    const onUpdateSuccess = () => {
        toastr.success('Update succesful.');
        getAllSchedule();
    };

    const onUpdateError = () => {
        toastr.error('Update not succesful.');
    };

    const getOrganizations = () => {
        GetAllOrganizations(0, 50).then(onGetOrganizationSuccess).catch(onGetOrganizationError);
    };

    const onGetOrganizationSuccess = (response) => {
        setOrgInfo(response.data.item.pagedItems.map(mapOrgSelect));
    };

    const onGetOrganizationError = () => {
        toastr.error('Error getting organization.');
    };

    const addSchedule = (payload) => {
        JobScheduleService.create(payload).then(onAddScheduleSuccess).catch(onAddScheduleError);
    };

    const onAddScheduleSuccess = () => {
        toastr.success('New schedule added.');
        getAllSchedule();
    };

    const onAddScheduleError = (error) => {
        toastr.error('Error adding schedule.', error);
    };

    const deleteSchedule = (id) => {
        JobScheduleService.deleteById(id).then(onDeleteSuccess).catch(onDeleteError);
    };

    const onDeleteSuccess = () => {
        toastr.success('Schedule delete.');
        getAllSchedule();
    };

    const onDeleteError = () => {
        toastr.error('Error deleting schedule.');
    };

    const getOrganizationsById = (org) => {
        JobScheduleService.getByOrgId(org).then(onGetOrganizationByIdSuccess).catch(onGetOrganizationByIdError);
    };

    const onGetOrganizationByIdSuccess = (response) => {
        setJobSchedules(() => {
            return response.items.map((event) => {
                return {
                    id: event.id,
                    title: 'Job Schedule',
                    start: new Date(event.startDate),
                    end: new Date(event.endDate),
                    className: 'bg-success',
                };
            });
        });
    };

    const onGetOrganizationByIdError = () => {
        toastr.error('Error getting organization information.');
    };

    const getAllSchedule = () => {
        JobScheduleService.getCreatedBy().then(onGetAllScheduleSuccess).catch(onGetAllScheduleError);
    };

    const onGetAllScheduleSuccess = (response) => {
        const data = response.items;
        setSelectItems(data.map(mapOrgFilter));
        setJobSchedules(() => {
            return data.map((event) => {
                let startTime = event.dailyStartTime;
                let endTime = event.dailyEndTime;
                return {
                    id: event.id,
                    title: `${event.jobName} | ${startTime}-${endTime}`,
                    start: new Date(event.startDate),
                    end: new Date(event.endDate),
                    allDay: true,
                    extendedProps: {
                        event,
                    },
                    className: 'bg-success',
                };
            });
        });
    };

    const onGetAllScheduleError = () => {
        toastr.error('Error getting all schedules.');
    };

    const mapOrgFilter = (org, index) => {
        return (
            <option key={`select_opt_orgfilter_${index}`} value={org.organizationId}>
                {org.organizationName}
            </option>
        );
    };

    const mapOrgSelect = (org, index) => {
        return (
            <option key={`select_opt_org_${index}`} value={org.id}>
                {org.name}
            </option>
        );
    };

    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row className="d-flex justify-content-center">
                                <Col>
                                    <h1>Job Schedule</h1>
                                </Col>
                                <Col xl={2}>
                                    <Formik>
                                        <Form>
                                            <Field
                                                as="select"
                                                name="color"
                                                onChange={handleSelectFilter}
                                                className="form-control">
                                                <option value="">Filter by Organization</option>
                                                <option value="">All</option>
                                                {selectItems}
                                            </Field>
                                        </Form>
                                    </Formik>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center mt-2">
                                <Col xl={9}>
                                    <Calendar
                                        onDateClick={onDateClick}
                                        onJobScheduleClick={onJobScheduleClick}
                                        jobSchedules={jobSchedules}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {show ? (
                <AddEditEvent
                    isOpen={show}
                    onClose={onCloseModal}
                    isEditable={isEditable}
                    jobScheduleData={jobScheduleData}
                    onUpdateJobSchedule={onUpdateJobSchedule}
                    onRemoveJobSchedule={onRemoveJobSchedule}
                    onAddJobSchedule={onAddJobSchedule}
                    orgInfo={orgInfo}
                />
            ) : null}
        </>
    );
};

export default CalendarApp;
