import Head from 'next/head'
import Dog from '../components/dog'
import Bowl from '../components/bowl'
import { useState } from 'react'
import { connectToDatabase } from '../util/firebase';

export default function Home({ feedData }) {
  const [morningFed, setMorningFed] = useState(feedData.morning)
  const [eveningFed, setEveningFed] = useState(feedData.evening)

  function handleFeed(time) {
    const status = time === 'morning' ? morningFed : eveningFed;
    const setters = { morning: setMorningFed, evening: setEveningFed }
    const set = setters[time]
    set(val => !val);
    
    fetch('/api/feed', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        status,
        time
      }),
    })
  }

  return (
    <div>
      <Head>
        <title>Grimm Feeder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container w-96 mx-auto p-4">
          <div className="flex flex-col h-screen justify-center items-center transform -translate-y-8">
            <h1 className="text-7xl">Grimm</h1>
            <h2 className="text-lg mt-4">Touch a bowl to feed me!</h2>
            <Dog className={`h-52 w-full mb-4 mt-16 transition duration-500 ease-in-out ${morningFed && eveningFed ? '' : 'animate-bounce'}`} />

            <div className="flex">
              <div className="flex flex-col items-center">
                <Bowl
                  className={`h-32 w-full cursor-pointer transition duration-500 ease-in-out ${
                    morningFed ? 'fill-current text-yellow-900' : ''
                  }`}
                  onClick={() => handleFeed('morning')}
                />
                <p className="text-gray-300 text-xl">9:00 AM</p>
              </div>

              <div className="flex flex-col items-center">
                <Bowl
                  className={`h-32 w-full cursor-pointer transition duration-500 ease-in-out ${
                    eveningFed ? 'fill-current text-yellow-900' : ''
                  }`}
                  onClick={() => handleFeed('evening')}
                />
                <p className="text-gray-300 text-xl">4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const db = await connectToDatabase();
  let status = null

  try {
    const snapshot = await db.ref().child('status').get()
    if (snapshot.exists()) {
      status = snapshot.val()
    } else {
      status = { error: 'No data' }
    }
  } catch (err) {
    console.error(err)
  }

  return {
    props: {
      feedData: status,
    },
  }
}
