import React from 'react'
import {
    Card,
    CardContent,
    Typography,
} from '@material-ui/core'
import './InfoBox.css'
import { prettyPrint } from '../../utils/utils'

function InfoBox({ title, cases, total, isRed, active, onClick }) { // destructuring {props object destructed to get keys title,cases,total}
    return (
        <Card className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"
            }`}
            onClick={onClick}>
            <CardContent>
                {/* Title of info box */}
                <Typography className='infoBox__title' color='textSecondary'>
                    {title}
                </Typography>

                {/* Number of Cases */}
                <h2 className={`infoBox__cases ${!isRed && 'infoBox--green'}`}>
                    {prettyPrint(cases)}
                </h2>

                {/* Total  */}
                <Typography className='infoBox__total' color='textSecondary'>
                    {prettyPrint(total)} Total
                 </Typography>

            </CardContent>
        </Card >
    )
}

export default InfoBox
