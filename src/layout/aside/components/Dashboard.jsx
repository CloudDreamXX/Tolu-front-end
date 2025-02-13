import React, { useState } from 'react';
import { allSymptoms, bodySystem, conditions, healthProtocols, herbsAndSupplements, lifestyleChanges, tests } from '../../../assets/data';
import AsideDropDown from '../AsideDropDown';

function Dashboard() {



    const [supplementsChecked, setSupplementsChecked] = useState([]);
    const [foodsChecked, setFoodsChecked] = useState([]);
    const [exercisesChecked, setExercisesChecked] = useState([]);
    const [bodySystemChecked, setBodySystemChecked] = useState([]);
    const [symptomsChecked, setSymptomsChecked] = useState([]);
    const [conditionsChecked, setConditionsChecked] = useState([]);
    const [testChecked, setTestCheck] = useState([]);
    const [herbsAndSupplementsChecked, setHerbsAndSupplementsChecked] = useState([]);

    return (
        <>
            <div className='flex  flex-col w-full'>

                <AsideDropDown name="Body System" options={bodySystem} onCheckedChange={(values) => setBodySystemChecked(values)} />
                <AsideDropDown name="Symptoms" options={allSymptoms} onCheckedChange={(values) => setSymptomsChecked(values)} />
                <AsideDropDown name="Condition" options={conditions} onCheckedChange={(values) => setConditionsChecked(values)} />
                <AsideDropDown name="Supplements" options={herbsAndSupplements} onCheckedChange={(values) => setSupplementsChecked(values)} />
                <AsideDropDown name="Foods" options={healthProtocols} onCheckedChange={(values) => setFoodsChecked(values)} />
                <AsideDropDown name="Exercises" options={lifestyleChanges} onCheckedChange={(values) => setExercisesChecked(values)} />
                <AsideDropDown name="Lab Tests" options={tests} onCheckedChange={(values) => setTestCheck(values)} />
                <AsideDropDown name="Herbs" options={herbsAndSupplements} onCheckedChange={(values) => setHerbsAndSupplementsChecked(values)} />
            </div>
        </>

    )
}

export default Dashboard