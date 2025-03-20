import { useState, useEffect } from 'react';
import Card from './components/Card';
import { mock } from './mock';
import { formatDate } from '../../../utils/format/formatDate';

function TopicMetric({ date, author }) {
    const [data, setData] = useState(mock);

    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            date: formatDate(date),
            author
        }));
    }, [date, author]);

    return (
        <div className='flex items-center gap-4 w-full'>
            {Object.keys(data).map((key) => (
                <Card key={key} id={key} value={data[key]} />
            ))}
        </div>
    );
}

export default TopicMetric;