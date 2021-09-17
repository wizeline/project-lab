import styled from "@emotion/styled"

export const Wrapper = styled.div`
  width: 100%;
  max-width: 997px;
  border-radius: 7px;
  background-color: #ffffff;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  h1 {
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
    padding-top: 158px;
    max-width: 307px;
    margin-left: auto;
    margin-right: auto;
  }
  h2 {
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
  }
  .wrapper__options {
    display: flex;
    justify-content: space-between;
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
    padding-top: 74px;
    padding-bottom: 74px;
  }
  button {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    background-color: #ff6f18;
    color: #ffffff;
    font-family: Poppins;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 29px;
    text-align: center;
    border: none;
    width: 160px;
    height: 44px;
    margin-top: 42px;
    cursor: pointer;
  }
`
