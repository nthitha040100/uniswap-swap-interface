import { ethers } from "ethers"
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"
import { computePoolAddress } from "@uniswap/v3-sdk"
import { POOL_FACTORY_CONTRACT_ADDRESS } from '@/app/constants/addresses'
import { Token } from "@uniswap/sdk-core"
import { FeeAmount } from "@uniswap/v3-sdk"

export async function getPoolData(
    provider: ethers.providers.Provider,
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount
) {
    try{

        const poolAddress = computePoolAddress({
            factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA,
            tokenB,
            fee,
        })        
        
        const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI.abi, provider)
        
        const [liquidity, slot0] = await Promise.all([
            poolContract.liquidity(),
            poolContract.slot0(),
        ])
        
        return {
            liquidity,
            sqrtPriceX96: slot0[0],
            tick: slot0[1],
        }
        
    }catch(err){
        console.error(err)
        return null;
    }
    }
    