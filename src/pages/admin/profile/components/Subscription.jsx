import React from 'react'

function Subscription() {
  return (
    <div className='w-80 flex items-center justify-center'>
        <section className='flex '>
            <section>
                {title}hallo
            </section>
            <section className='h-6 text-white bg-primary rounded-lg '>
                {sagus}
            </section>
        </section>
        <section className='text-4xl text-black font-normal'>
            {cost}<span className='text-xs text-primary font-normal'>/per month</span>
        </section>
        <section>
            <section>
                {required}
            </section>
            <section>
                {discription}
            </section>
        </section>
        <section></section>
    </div>
  )
}

export default Subscription