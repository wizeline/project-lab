import styled from "@emotion/styled"

export const ProposalCardWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  .ProposalCard__head {
    display: flex;
    align-items: center;
  }
  .ProposalCard__head__icon span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border: 2px solid #234cad;
    border-radius: 50%;
    font-weight: bold;
    color: #234cad;
    font-size: 16px;
  }
  .ProposalCard__head__icon img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
  }
  .ProposalCard__head__description {
    margin-left: 20px;
    width: calc(100% - 60px - 20px);
  }
  .ProposalCard__head__description--title {
    color: #234cad;
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
  }
  .ProposalCard__head__description--date {
    color: #234cad;
    font-weight: 700;
    font-size: 12px;
  }
  .ProposalCard--description {
    height: 40px;
    color: #727e8c;
    font-family: Poppins;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 21px;
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .ProposalCard__status {
    /* width: 90%;
    position: absolute;
    bottom: 15px;
    right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center; */
    width: 100%;
    bottom: 5px;
    right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    & > div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .ProposalCard__status--display {
    /* margin: 0 10px;
    width: 100px;
    height: 25px;
    border-radius: 4px;
    bottom: 10px;
    right: 20px;
    color: #fff;
    text-align: center;
    font-size: 12px;
    line-height: 25px; */

    height: 25px;
    color: #234cad;
    font-size: 12px;
    line-height: 25px;
  }
  .ProposalCard__status--like {
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: #234cad;
    font-size: 14px;

    & span {
      margin-left: 3px;
    }
  }

  hr {
    height: 1px;
    width: 100%;
    background-color: #234cad;
    margin-bottom: 5px;
  }

  .ProposalCard__skills {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
  }

  .ProposalCard__skills--title {
    margin: 0 5px;
    background-color: #234cad;
    color: #fff;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 11px;

    &:first-of-type {
      margin-left: 0;
    }
  }
`
