import React from 'react'

interface IObjectStep {
  step: Number;
  icon: string;
  text: string;
}

interface IActiveStep {
  steps: Array<IObjectStep>;
  activeStep: Number;
  onClick: Function;
}

const SidebarStep = ({ steps, activeStep, onClick }: IActiveStep) => {
  return (
    <>
      <div className='wrapper'>
        <ul>
          {steps.map((stepItem) => (
            <li onClick={() => onClick(stepItem.step)} className={activeStep === stepItem.step ? 'active' : ''}>
              <div className="icon">
                <img src={stepItem.icon} alt="ProjectLab" />
              </div>
              <div className="text">
                {stepItem.text}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .wrapper {
          border: 0.5px solid #C7CFD6;
          border-radius: 4px;
          background-color: #FAFBFB;
        }
        ul {
          list-style: none;
          margin: 35px 0px 70px;
        }
        li {
          margin: 18px 0px;
          color: #475F7B;
          font-family: Poppins;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 23px;
          display: flex;
          padding-left: 19px;
          padding-right: 19px;
          padding-top: 17px;
          padding-bottom: 17px;
          user-select: none;
          cursor: pointer;
        }
        .icon {
          width: 24px;
          height: 24px;
        }
        .icon img {
          width: 100%;
        }
        .active {
          background-color: #EDF3FD;
          color: #5A8DEE;
          font-family: Poppins;
          font-size: 15px;
          letter-spacing: 0;
          line-height: 23px;
        }
      `}</style>
    </>
  )
}

export default SidebarStep
