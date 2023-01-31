/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { DataSet, Timeline } from "vis-timeline/standalone";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";
import { ResolutionStep } from "_core/components/Timeline";
import * as mapActions from "_core/actions/mapActions";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Timeline/TimelineContainer.scss";
import displayStyles from "_core/styles/display.scss";

const DAY_IN_MS = 86400000;
const MIN_DATE_MOMENT = moment(appConfig.MIN_DATE);
const MAX_DATE_MOMENT = moment(appConfig.MAX_DATE);

// Bin sizes in ms for each date resolution
// TODO move this into config?
const BIN_SIZES_MS = {
    seconds: DAY_IN_MS / 48 / 48 / 48,
    minutes: DAY_IN_MS / 48 / 48,
    hours: DAY_IN_MS / 48,
    days: DAY_IN_MS,
    months: DAY_IN_MS * 15,
    years: DAY_IN_MS * 150,
};

// Mapping from date resolution values from config to scale values
// used by VisJS
const VIS_SCALE_SIZES = {
    seconds: "second",
    minutes: "minute",
    hours: "hour",
    days: "day",
    months: "month",
    years: "year",
};

// Offset of the item when scrolling an item into view
// as a proportion of the current windowsize
const ITEM_SCROLL_OFFSET = 0.2;

// margin for the timeline within it's container
const CONTAINER_MARGIN = 64;

// id for the item indicating the current date
const CURR_DATE_ITEM_ID = "_currentDateItem";

export class TimelineContainer extends Component {
    componentDidMount() {
        this.isDragging = false;

        // get the default items
        this.items = this.getDefaultTimelineItems();

        // Best guess width, will be off if other sibling elements around timeline have not
        // rendered yet.
        this.timelineContainerWidth = this.getContainerWidth();

        // Create a timeline
        this.timeline = new Timeline(
            this.timelineContainerRef,
            this.items,
            this.getTimelineOptions()
        );

        this.initializeTimelineListeners();

        // Listen window resize events and trigger resize of timeline
        window.onresize = (evt) => {
            this.handleWindowResize(evt);
        };
    }

    componentDidUpdate(prevProps) {
        let currDate = this.props.date;
        let prevDate = prevProps.date;
        let currRes = this.props.dateSliderTimeResolution.get("resolution");
        let prevRes = prevProps.dateSliderTimeResolution.get("resolution");

        // If we're not dragging the date then we can update the timeline item from props
        if (!this.isDragging) {
            // keep the current date indicator on a tick
            let item = this.items.get(CURR_DATE_ITEM_ID);
            item.start = moment(currDate).startOf(currRes);
            this.items.update(item);
        }

        // If date resolution has changed, configure timeline for the new resolution
        if (prevRes !== currRes) {
            // set the new axis resolution value and the start and end time
            let { start, end } = this.calculateTimelineRange(moment(currDate));
            this.timeline.setOptions({
                timeAxis: {
                    scale: VIS_SCALE_SIZES[currRes],
                    step: 1,
                },
                start: start,
                end: end,
            });

            // Focus on appDate to account for possibility of new resolution
            // throwing the appDate out of view
            this.focusOnItem(CURR_DATE_ITEM_ID);
        } else {
            this.bringItemIntoView(CURR_DATE_ITEM_ID, { duration: 250 });
        }
    }

    getTimelineOptions() {
        // Calculate start and end timeline date window using appDate
        let appDate = moment(this.props.date);
        let { start, end } = this.calculateTimelineRange(appDate);
        let dateResolution = this.props.dateSliderTimeResolution.get("resolution");

        return {
            type: "point",
            showCurrentTime: false,
            zoomable: false,
            tooltipOnItemUpdateTime: { template: this.getTimelineTooltipFunc() },
            itemsAlwaysDraggable: true,
            editable: {
                updateTime: true,
            },
            snap: this.getItemSnappingFunc(),
            onMove: this.getItemDragFunc(),
            onMoving: this.getItemDraggingFunc(),
            start: start, // Start date of timeline date range window
            end: end, // End date of timeline date range window
            height: "60px",
            min: MIN_DATE_MOMENT, // Min date of timeline
            max: MAX_DATE_MOMENT, // Max date of timeline
            width: "100%",
            timeAxis: {
                scale: VIS_SCALE_SIZES[dateResolution],
                step: 1,
            },
            onInitialDrawComplete: () => {
                this.handleInitialDraw();
            },
        };
    }

    getContainerWidth() {
        return this.timelineContainerRef.clientWidth - CONTAINER_MARGIN;
    }

    initializeTimelineListeners() {
        this.timeline.on("click", (props) => {
            this.handleTimelineClick(props);
        });

        this.timeline.on("rangechange", (props) => {
            this.handleTimelineDragging(props);
        });

        this.timeline.on("rangechanged", (props) => {
            this.handleTimelineDrag(props);
        });
    }

    handleWindowResize(evt) {
        this.resizeTimeline();
    }

    getDefaultTimelineItems() {
        let appDate = moment(this.props.date);
        let currentDateItem = { id: CURR_DATE_ITEM_ID, start: appDate };
        return new DataSet([currentDateItem]);
    }

    handleInitialDraw() {
        window.requestAnimationFrame(() => {
            // Redraw timeline after initial draw to adjust for actual size
            // since sibling DOM elements may have not been rendered at time of
            // initial timeline width calculation
            this.resizeTimeline();

            // Focus on appDate item
            this.focusOnItem(CURR_DATE_ITEM_ID);

            // this.timeline.redraw();
        });
    }

    getItemDragFunc() {
        return (item, callback) => {
            this.setTimelineClassActive(styles.timelineDragging, false);
            this.setTimelineClassActive(styles.overflow, false);
            this.isDragging = false;
            item.moving = false;

            // get nearest date
            let snappedDate = this.snapDate(
                item.start,
                this.props.dateSliderTimeResolution.get("resolution"),
                false
            );

            // mask just the current resolution update
            let maskedDate = this.maskDate(
                this.props.date,
                snappedDate.toDate(),
                this.props.dateSliderTimeResolution.get("resolution")
            );

            let newDate = maskedDate;

            item.start = snappedDate;

            // item.start = newDate;
            callback(item);

            this.bringItemIntoView(item.id, { duration: 250 });

            if (!newDate.isSame(moment(this.props.date))) {
                this.props.mapActions.setDate(newDate);
            }
        };
    }

    getItemDraggingFunc() {
        return (item, callback) => {
            this.setTimelineClassActive(styles.timelineDragging, true);
            this.setTimelineClassActive(styles.overflow, true);
            this.isDragging = true;

            item.moving = true;

            // get nearest date
            let snappedDate = this.snapDate(
                item.start,
                this.props.dateSliderTimeResolution.get("resolution"),
                false
            );

            // mask just the current resolution update
            let maskedDate = this.maskDate(
                this.props.date,
                snappedDate.toDate(),
                this.props.dateSliderTimeResolution.get("resolution")
            );

            let newDate = maskedDate;

            // Prevent drag past visible dates
            let { start, end } = this.timeline.getWindow();
            if (item.start <= start) {
                item.start = this.clampDate(start);
            } else if (item.start >= end) {
                item.start = this.clampDate(end);
            } else {
                if (!newDate.isSame(moment(this.props.date))) {
                    this.props.mapActions.setDate(newDate);
                }
            }
            callback(item);
        };
    }

    handleTimelineClick(props) {
        // Incomplete attempt at preventing click events firing on drag end on timeline
        // For now, disable clicking on background.
        // Check for snapped time, not all events are guaranteed to have one
        if (props.what === "background" || props.what === "item" || !props.snappedTime) {
            return;
        }
        // Determine major/minor label click
        if (props.event.target.classList.contains("vis-minor")) {
            let snappedDate = this.snapDate(
                props.snappedTime,
                this.props.dateSliderTimeResolution.get("resolution")
            );

            let maskedDate = this.maskDate(
                this.props.date,
                snappedDate.toDate(),
                this.props.dateSliderTimeResolution.get("resolution")
            );

            let newDate = maskedDate;

            this.props.mapActions.setDate(newDate);
        } else if (
            props.event.target.classList.contains("vis-major") ||
            (props.event.target.tagName === "DIV" &&
                props.event.target.parentElement.classList.contains("vis-major"))
        ) {
            let currentResolution = MiscUtil.findObjectWithIndexInArray(
                appConfig.DATE_SLIDER_RESOLUTIONS,
                "resolution",
                this.props.dateSliderTimeResolution.get("resolution")
            );

            let dateTxt = props.event.target.innerText;
            let dateFormat =
                appConfig.DATE_SLIDER_RESOLUTIONS[currentResolution.index].visMajorFormat;
            let date = moment(dateTxt, dateFormat);
            this.props.mapActions.setDate(date);
        }
    }

    handleTimelineDragging(props) {
        this.setTimelineClassActive(styles.timelineDragging, true);
    }

    handleTimelineDrag(props) {
        this.setTimelineClassActive(styles.timelineDragging, false);
    }

    getItemSnappingFunc() {
        return (date, scale, step) => {
            // snap to nearest second for smooth dragging
            let millisecond = 1000;
            return Math.round(date / millisecond) * millisecond;
        };
    }

    getTimelineTooltipFunc() {
        return (data) => {
            // Create tooltip by adding an element to item content
            let classes = data.moving ? styles.dotTooltip : styles.dotTooltipHidden;

            let snappedDate = this.snapDate(
                data.start,
                this.props.dateSliderTimeResolution.get("resolution"),
                false
            );

            let maskedDate = this.maskDate(
                this.props.date,
                snappedDate.toDate(),
                this.props.dateSliderTimeResolution.get("resolution")
            );

            let label = maskedDate.format(this.props.dateSliderTimeResolution.get("format"));
            return label;
        };
    }

    setTimelineClassActive(classStr, active) {
        // Set dragging class on the axis
        let axis = this.getTimelineContainerNode();
        if (active) {
            axis.classList.add(classStr);
        } else {
            axis.classList.remove(classStr);
        }
    }

    checkItemInView(itemId, options = {}) {
        return new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => {
                let item = this.items.get(itemId);
                if (item) {
                    let { start, end } = this.timeline.getWindow();
                    let axisStep = this.timeline.timeAxis.step;
                    let bufferScale =
                        typeof options.bufferScale !== "undefined" ? options.bufferScale : 0.75;
                    let min = moment(start).add(axisStep.step * bufferScale, axisStep.scale);
                    let max = moment(end).subtract(axisStep.step * bufferScale, axisStep.scale);
                    let date = moment(item.start);
                    if (date.isBefore(min)) {
                        resolve({ left: true, right: false });
                    } else if (date.isAfter(max)) {
                        resolve({ left: false, right: true });
                    } else {
                        resolve({ left: false, right: false });
                    }
                }
            });
        });
    }

    bringItemIntoView(itemId, options = {}) {
        this.checkItemInView(itemId, options).then(
            (data) => {
                let duration = typeof options.duration !== "undefined" ? options.duration : 0;
                let item = this.timeline.itemsData.get(itemId);
                if (item) {
                    let { start, end } = this.timeline.getWindow();
                    let windowSizeMs = end - start;
                    if (data.left) {
                        let newStart = moment(item.start).subtract(
                            windowSizeMs * ITEM_SCROLL_OFFSET,
                            "milliseconds"
                        );
                        let newEnd = newStart.clone().add(windowSizeMs, "milliseconds");
                        this.timeline.setWindow(newStart, newEnd, {
                            animation: duration === 0 ? false : { duration: duration },
                        });
                    } else if (data.right) {
                        let newEnd = moment(item.start).add(
                            windowSizeMs * ITEM_SCROLL_OFFSET,
                            "milliseconds"
                        );
                        let newStart = newEnd.clone().subtract(windowSizeMs, "milliseconds");
                        this.timeline.setWindow(newStart, newEnd, {
                            animation: duration === 0 ? false : { duration: duration },
                        });
                    }
                } else {
                    console.warn(
                        "Error in TimelineContainer.bringItemIntoView: failed to find item with id ",
                        itemId
                    );
                }
            },
            (err) => {
                console.warn("Error in TimelineContainer.bringItemIntoView: ", err);
            }
        );
    }

    focusOnItem(itemId, duration = 0) {
        this.timeline.focus(itemId, {
            animation: duration === 0 ? false : { duration: duration },
            zoom: false,
        });
    }

    resizeTimeline() {
        this.timelineContainerWidth = this.getContainerWidth();
        let { start, end } = this.calculateTimelineRange(moment(this.timeline.getWindow().start));
        this.timeline.setOptions({ start: start, end: end });
    }

    snapDate(date, resolution, clamp = true) {
        let newDate = moment(date);

        // Round to nearest date based on resolution
        switch (resolution) {
            case appStrings.SECONDS:
                if (newDate.milliseconds() >= 500) {
                    newDate.add(1, "second");
                }
                newDate = newDate.startOf("second");
                break;
            case appStrings.MINUTES:
                if (newDate.seconds() >= 30) {
                    newDate.add(1, "minute");
                }
                newDate = newDate.startOf("minute");
                break;
            case appStrings.HOURS:
                if (newDate.minutes() >= 30) {
                    newDate.add(1, "hour");
                }
                newDate = newDate.startOf("hour");
                break;
            case appStrings.DAYS:
                if (newDate.hour() >= 12) {
                    newDate.add(1, "day");
                }
                newDate = newDate.startOf("day");
                break;
            case appStrings.MONTHS:
                if (newDate.date() >= newDate.daysInMonth() / 2) {
                    newDate.add(1, "month");
                }
                newDate = newDate.startOf("month");
                break;
            case appStrings.YEARS:
                if (newDate.month() >= 5) {
                    newDate.add(1, "year");
                }
                newDate = newDate.startOf("year");
                break;
            default:
                console.warn("Warning: date snap resolution:", resolution, " not recognized");
                break;
        }
        if (clamp) {
            return this.clampDate(newDate);
        }
        return newDate;
    }

    maskDate(date, mDate, resolution) {
        date = moment(date);
        mDate = moment(mDate);
        switch (resolution) {
            case appStrings.SECONDS:
                date.second(mDate.second());
            // falls through
            case appStrings.MINUTES:
                date.minute(mDate.minute());
            // falls through
            case appStrings.HOURS:
                date.hour(mDate.hour());
            // falls through
            case appStrings.DAYS:
                date.month(mDate.month()); // handle 31/30 day wrap
                date.date(mDate.date());
            // falls through
            case appStrings.MONTHS:
                date.month(mDate.month());
            // falls through
            case appStrings.YEARS:
                date.year(mDate.year());
                break;
            default:
                console.warn("Error in TimeAxis.maskDate: unknown date resolution. ", resolution);
        }
        return date;
    }

    clampDate(date) {
        let newDate = moment(date);
        // Clamp date to min and max dates of appConfig
        if (newDate.isAfter(appConfig.MAX_DATE)) {
            return MAX_DATE_MOMENT;
        } else if (newDate.isBefore(appConfig.MIN_DATE)) {
            return MIN_DATE_MOMENT;
        }
        return newDate;
    }

    calculateTimelineRange(start) {
        let binWidth = 30; // Pixel width of each tick bin (for Days)
        let end = start
            .clone()
            .add(
                (this.timelineContainerWidth / binWidth) *
                    BIN_SIZES_MS[this.props.dateSliderTimeResolution.get("resolution")]
            );
        return { start: start, end: end };
    }

    getTimelineContainerNode() {
        return document.getElementsByClassName(styles.container)[0];
    }

    render() {
        let stepSizeClass =
            styles["stepSize_" + this.props.dateSliderTimeResolution.get("resolution")];
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.elementsContainer]: true,
            [displayStyles.hiddenFadeIn]: !this.props.distractionFreeMode,
            [displayStyles.hiddenFadeOut]: this.props.distractionFreeMode,
            [this.props.className]: typeof this.props.className !== "undefined",
        });
        let timelineClasses = MiscUtil.generateStringFromSet({
            [styles.timeline]: true,
            [stepSizeClass]: true,
        });
        return (
            <div className={containerClasses}>
                <div className={styles.timelineBackground}>
                    <div className={styles.container}>
                        <div
                            className={timelineClasses}
                            ref={(ref) => (this.timelineContainerRef = ref)}
                        />
                    </div>
                    {appConfig.DATE_SLIDER_RESOLUTIONS.length > 1 ? <ResolutionStep /> : null}
                </div>
            </div>
        );
    }
}

TimelineContainer.propTypes = {
    date: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    distractionFreeMode: PropTypes.bool.isRequired,
    dateSliderTimeResolution: PropTypes.object.isRequired,
    className: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date"),
        distractionFreeMode: state.view.get("distractionFreeMode"),
        dateSliderTimeResolution: state.dateSlider.get("resolution"),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer);
