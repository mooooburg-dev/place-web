import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import moment from 'moment'

const NewsContainer = () => {
	const baseUrl = process.env.REACT_APP_BASE_URL

	const [newsList, setNewsList] = useState([])
	const [tempKeyword, setTempKeyword] = useState('')
	const [keyword, setKeyword] = useState('')
	const [keywords, setKeywords] = useState([])
	const [cookies, setCookie, removeCookie] = useCookies(['strKeywords'])

	async function getNews() {
		if (keyword) {
			const response = await axios.get(baseUrl + '/punchline', {
				params: {
					keyword: keyword,
				},
			})

			if (keyword !== '' && !keywords.includes(keyword)) {
				setKeywords([...keywords, keyword])
			}

			setNewsList(response.data.items.concat())
		}
	}

	useEffect(() => {
		setTempKeyword(keyword)
		getNews()
	}, [keyword])

	useEffect(() => {
		getCookie()
	}, [])

	useEffect(() => {
		setCookieFunc()
	}, [keywords])

	const handleSubmit = (event) => {
		event.preventDefault()
	}

	const setCookieFunc = () => {
		if (keywords && keywords.length > 0)
			setCookie('strKeywords', keywords.join(','), { maxAge: 3600 })
	}

	const getCookie = (param) => {
		let result = cookies.strKeywords
		if (result) console.log(result.split(','))

		if (result) {
			setKeywords(result.split(','))
			setKeyword(result.split(',')[0])
			getNews()
		} else {
			setKeyword('')
		}
	}

	const removeCookieFucnc = () => {
		removeCookie('strKeywords')
	}

	const onChange = (e) => {
		setTempKeyword(e.target.value)
	}

	const onKeyPress = (e) => {
		if (e.key === 'Enter') {
			setKeyword(e.target.value)
		}
	}

	const onClickConfirm = (e) => {
		setKeyword(tempKeyword)
	}

	const onTagClick = (tag) => {
		setKeyword(tag)
	}

	return (
		<div className="news-container">
			<div className="input-wapper">
				<form className="row input-form" onSubmit={handleSubmit}>
					<div className="mr-2">
						<input
							className="form-control form-control-lg input-place"
							type="text"
							onChange={onChange}
							onKeyPress={onKeyPress}
							value={tempKeyword}></input>
					</div>
					<div>
						<button
							type="submit"
							className="btn btn-danger btn-lg"
							onClick={onClickConfirm}>
							검색
						</button>
					</div>
				</form>
			</div>
			<hr />
			{newsList.length === 0 && (
				<div className="no-content text-center">
					가볍고 빠른 뉴스 검색 - 펀치라인
				</div>
			)}
			<div className="tag-wrapper">
				{keywords &&
					keywords.length > 0 &&
					keywords.map((tag, index) => {
						return (
							<button
								className="btn btn-outline-primary btn-sm tag-keyword"
								key={index}
								value={tag}
								onClick={() => onTagClick(tag)}
								readOnly>
								{tag}
							</button>
						)
					})}
			</div>
			{newsList &&
				newsList.map((el, index) => {
					return (
						<div key={index} className="news-item">
							<a href={el.originallink}>
								<div
									className="news-title"
									dangerouslySetInnerHTML={{ __html: el.title }}></div>
							</a>
							<div dangerouslySetInnerHTML={{ __html: el.description }}></div>
							<div>[{moment(el.pubDate).format('YYYY-MM-DD')}]</div>
						</div>
					)
				})}
		</div>
	)
}

export default NewsContainer
