import React from "react"

interface IObjectStep {
  step: Number
  icon: string
  text: string
}

interface IActiveStep {
  steps: Array<IObjectStep>
  activeStep: Number
  onClick: Function
}

const SidebarStep = ({ steps, activeStep, onClick }: IActiveStep) => {
  return (
    <>
      <div className="wrapper">
        <ul>
          {steps.map((stepItem, index) => (
            <li
              key={index}
              onClick={() => onClick(stepItem.step)}
              className={activeStep === stepItem.step ? "active" : ""}
            >
              <div className="icon">
                <img src={stepItem.icon} alt="ProjectLab" />
              </div>
              <div className="text">{stepItem.text}</div>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .wrapper  {
          border: 0.5px solid #c7cfd6;
          border-radius: 4px;
          background-color: #fafbfb;
        }
        ul {
          list-style: none;
          margin: 35px 0px 70px;
        }
        li {
          margin: 18px 0px;
          color: #475f7b;
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
          background-color: #edf3fd;
          color: #5a8dee;
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
