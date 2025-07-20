import "./cards.css";

export default function Cards({title,value,icon,color}){
    
    return(

        <div className="stat-card">

            <div className="stat-icon">
                {icon}
            </div>

            <div className="stat-content">

                <div className="stat-title">{title}</div>
                <div className="stat-value" style={{ color: color }}>{value}</div>

            </div>
     
        </div>
    );

}
