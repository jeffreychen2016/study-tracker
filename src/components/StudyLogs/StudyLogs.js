import React from 'react';
import './StudyLogs.css';
import LogCard from '../LogCard/LogCard';

class StudyLogs extends React.Component {
  categoryId = this.props.match.params.categoryid;

  render () {
    return (
      <div className="StudyLogs">
        <h2>StudyLogs</h2>
        <LogCard 
          categoryId={this.categoryId}
        />
      </div>
    );
  };
};

export default StudyLogs;
