import styled from "@emotion/styled"

export const Wrapper = styled.div`
  margin-top: 35px;
  margin-bottom: 100px;
  max-width: 997px;
  margin-left: auto;
  margin-right: auto;
  .homeWrapper__navbar {
    background-color: #fff;
    height: 58px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 21px;
  }
  .homeWrapper__navbar__sort {
    margin-left: 49px;
  }
  .homeWrapper__navbar__button {
    display: flex;
    align-items: center;
    margin-right: 49px;
  }
  .homeWrapper__navbar__button button {
    background-image: url(/add.png);
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 15px 50%;
    border: none;
    color: #ffffff;
    font-family: Poppins;
    font-size: 15px;
    font-weight: 600;
    width: 160px;
    letter-spacing: 0;
    line-height: 29px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #ff6f18;
    padding: 7px 7px 8px 41px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  }

  .homeWrapper--content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .homeWrapper__navbar {
  }
  .homeWrapper__information {
    width: 100%;
    max-width: 597px;
  }
  .homeWrapper__information--row {
    margin-bottom: 20px;
  }
  .homeWrapper__information--row:last-child {
    margin-bottom: 0px;
  }
  .homeWrapper__popular {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    row-gap: 35px;
    column-gap: 15px;
    margin-bottom: 35px;
  }
  .homeWrapper__myProposals {
    display: grid;
    row-gap: 35px;
    width: 100%;
    max-width: 390px;
    margin-left: 15px;
  }
  .pageButton {
    margin-right: 10px;
  }
`

// const Default = { Wrapper: Wrapper }
// export default Default

export default Wrapper
