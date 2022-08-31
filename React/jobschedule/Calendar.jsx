import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';
import PropTypes from 'prop-types';

const Calendar = ({ onDateClick, onJobScheduleClick, jobSchedules }) => {
    const handleDateClick = (arg) => {
        onDateClick(arg);
    };

    const handleEventClick = (arg) => {
        onJobScheduleClick(arg);
    };

    return (
        <>
            <div id="calendar">
                <FullCalendar
                    initialView="dayGridMonth"
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, BootstrapTheme]}
                    handleWindowResize={true}
                    themeSystem="bootstrap"
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                        list: 'List',
                        prev: 'Prev',
                        next: 'Next',
                    }}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                    }}
                    events={jobSchedules}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                />
            </div>
        </>
    );
};

Calendar.propTypes = {
    onDateClick: PropTypes.func.isRequired,
    onJobScheduleClick: PropTypes.func.isRequired,
    jobSchedules: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Calendar;
