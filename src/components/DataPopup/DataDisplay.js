import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { LonLatCoordinates } from "_core/components/Reusables";
import styles from "components/DataPopup/DataDisplay.scss";
import displayStyles from "_core/styles/display.scss";
import MiscUtil from "_core/utils/MiscUtil";
import { List } from "immutable";

export class DataDisplay extends Component {
    renderExtra(props) {
        let extraContent = [];
        for (let [key, value] of props) {
            if (value instanceof List) {
                extraContent.push(
                    <div key={"extra-prop-" + key} className={styles.valueContainer}>
                        <Typography variant="body1" className={styles.valueLabel}>
                            {" "}
                            <b>{key}</b> :{" "}
                        </Typography>
                        <Table>
                            <TableBody>
                                {value.filter(Boolean).map((row, i) => (
                                    <TableRow key={"row-" + i} className={styles.tableRow}>
                                        {row.filter(Boolean).map((cell, i) => (
                                            <TableCell
                                                key={"cell-" + i}
                                                padding="dense"
                                                scope="row"
                                            >
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                );
            } else {
                if (value.length > 0) {
                    extraContent.push(
                        <div key={"extra-prop-" + key} className={styles.valueContainer}>
                            <Typography variant="body1" className={styles.valueLabel}>
                                {" "}
                                <b>{key}</b> : {value}
                            </Typography>
                        </div>
                    );
                }
            }
        }
        return extraContent;
    }

    render() {
        const dataProps = this.props.data.get("properties");

        //formatage des dates
        let beginTimeStr = moment(
            dataProps.get("dateStart"),
            this.props.data.getIn(["layer", "timeFormat"])
        ).format("DD/MM/YYYY, HH:mm:ss UTC");

        let endTimeStr = moment(
            dataProps.get("dateEnd"),
            this.props.data.getIn(["layer", "timeFormat"])
        ).format("DD/MM/YYYY, HH:mm:ss UTC");

        const dataURL = dataProps.get("data");

        let coords = this.props.data.get("coords");

        let middleClasses = MiscUtil.generateStringFromSet({
            [styles.middleContent]: true,
            [displayStyles.hidden]: dataProps.get("extra").size === 0
        });

        let linkClasses = MiscUtil.generateStringFromSet({
            [displayStyles.hidden]: !dataURL
        });

        return (
            <div className={styles.root}>
                <div className={styles.titleContainer}>
                    <Typography variant="body2" color="inherit" className={styles.title}>
                        {dataProps.get("featureTitle")}
                    </Typography>
                    <Typography variant="body2" color="inherit" className={styles.subtitle}>
                        {dataProps.get("featureSubtitle")}
                    </Typography>
                </div>
                <div className={middleClasses}>{this.renderExtra(dataProps.get("extra"))}</div>
                <div className={styles.bottomContent}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={6}>
                            <Grid
                                container
                                className={styles.fullh}
                                alignItems="center"
                                justify="flex-start"
                            >
                                <LonLatCoordinates
                                    className={styles.clickCoordinatesRoot}
                                    lat={coords.get(0)}
                                    lon={coords.get(1)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} className={linkClasses}>
                            <Grid
                                container
                                className={styles.fullh}
                                alignItems="center"
                                justify="flex-end"
                            >
                                <Button href={dataURL} color="primary" size="small" target="_blank">
                                    To profile data
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

DataDisplay.propTypes = {
    data: PropTypes.object.isRequired
};

export default DataDisplay;
