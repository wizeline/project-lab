import { Image } from "blitz"
import styled from "@emotion/styled"

export const Screen = styled.div`
  position: fixed;
  background: #fff;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;

  img {
    animation: mymove 0.6s infinite linear;
  }

  @keyframes mymove {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export const ScreenBox = styled.div`
  width: 160px;
  margin: 0 auto;
  text-align: center;
`

export const Loader = () => {
  return (
    <Screen>
      <ScreenBox>
        <Image src="/wizeline.png" className="rod" alt="wizeline" height={80} width={80} />
        <div>Please standby ...</div>
      </ScreenBox>
    </Screen>
  )
}

export default Loader
