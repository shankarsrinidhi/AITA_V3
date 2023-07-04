import { useState, useEffect } from "react";
import "../css_components/ReportCards.css";


function ReportCards() {
  const [cards, setCards] = useState([]);

  const getCards = async () => {
    try {
      const response = await fetch(`http://localhost:5000/1/pastweeklyreports/check`);
      const jsonData = await response.json();
      

      setCards(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  

  useEffect(() => {
    getCards();
  }, []);
  console.log(cards);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  return (
    <div>
      <section>
        <div className="container">
          
          <div className="cards">
            {cards.length < 1 ? 
            (<>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h5 className="center mt-3">You have not submitted any reports in the past.</h5>
                </div>
            </>) : <>
            {cards.map((card, i) => (
              <div key={i} className="speccard" onClick={() => window.location = `/weeklyReport/${card.report.week_end_date}`}>
                <div><h3 className="text-center">Week Ending {formatDate(card.report.week_end_date)}</h3></div>
                <hr style={{color: '#8f0000', width: '100%', margin:'2px'}}></hr>
                <h6 className="text-center" style={{color:'#8f0000'}}>Progress reported for the week</h6>
                <ul style={{listStyleType:'circle', paddingLeft:'1rem'}}>
                {card.report.progress.length < 1 ? (<p>No progress reported</p>):(<>
                    {card.report.progress.map((item, index) => (
                    <li key={index}>{item.progress_title}</li>
                ))}
                </>)}
                </ul>
                


                {/*<p>{card.text}</p>*/}
                
              </div>
            ))}</> }
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportCards;