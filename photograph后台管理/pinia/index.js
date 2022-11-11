import {
	useProduct
} from './product'
export default function useStore() {
	return {
		product: useProduct()
	};
}
