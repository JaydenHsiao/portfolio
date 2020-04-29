import React from "react"

import { graphql } from "gatsby"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

import { INLINES, BLOCKS } from "@contentful/rich-text-types"
import Head from "../components/head"

import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

import ProgressiveImage from "react-progressive-image-loading"

import blogTemplateStyles from "./blog_template.module.scss"

const website_url = "https://jaydenhsiao.me"

export const query = graphql`
  query($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      body {
        json
      }
    }
  }
`

const Blog = props => {
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => {
        const words = node.data.target.fields.title["en-US"].split(" ")
        var asset_width =
          node.data.target.fields.file["en-US"].details.image.width
        var asset_height =
          node.data.target.fields.file["en-US"].details.image.height

        var ratio = asset_height / asset_width
        if (ratio > 1 && asset_width < 1000) {
          const alt = node.data.target.fields.description["en-US"]
          const url = node.data.target.fields.file["en-US"].url
          return (
            <React.Fragment>
              <div className={blogTemplateStyles.portraitContainer}>
                <ProgressiveImage
                  preview={`${url}?w=800&fm=webp&q=1`}
                  src={`${url}?w=800&fm=webp&q=80`}
                  render={(src, style) => (
                    <img src={src} style={style} alt={`${alt}`} />
                  )}
                />
                <div className={blogTemplateStyles.captionContainer}>
                  {" "}
                  <p className={blogTemplateStyles.caption}>
                    {node.data.target.fields.description["en-US"]}
                  </p>
                </div>
              </div>
              <br />
            </React.Fragment>
          )
        } else if (
          words[words.length - 1] === "(Grid)" ||
          words[words.length - 2] === "(Grid)"
        ) {
          const alt = node.data.target.fields.description["en-US"]
          const url = node.data.target.fields.file["en-US"].url
          return (
            <Zoom>
              <img
                alt={alt}
                src={`${url}?w=800&fm=webp&q=80`}
                className={blogTemplateStyles.photography}
              />
            </Zoom>
          )
        } else {
          const alt = node.data.target.fields.description["en-US"]
          const url = node.data.target.fields.file["en-US"].url
          return (
            <React.Fragment>
              <div className={blogTemplateStyles.imageContainer}>
                {/* <Zoom>
                  <img alt={alt} src={`${url}?w=800&fm=webp&q=80`} />
                </Zoom> */}
                <ProgressiveImage
                  preview={`${url}?w=800&fm=webp&q=1`}
                  src={`${url}?w=800&fm=webp&q=80`}
                  render={(src, style) => (
                    <img src={src} style={style} alt={`${alt}`} />
                  )}
                />
                <div className={blogTemplateStyles.captionContainer}>
                  {" "}
                  <p className={blogTemplateStyles.caption}>
                    {node.data.target.fields.description["en-US"]}
                  </p>
                </div>
              </div>
              <br />
            </React.Fragment>
          )
        }
      },
      [BLOCKS.EMBEDDED_ENTRY]: node => {
        if (node.data.target.sys.contentType.sys.id === "miroEmbed") {
          let str =
            `${node.data.target.fields.src["en-US"]}`.replace(
              `board`,
              `embed`
            ) + "=/?autoplay=yep"
          return (
            <React.Fragment>
              <iframe
                title={`${node.data.target.fields.title["en-US"]}`}
                width="100%"
                height="500"
                src={`${str}`}
                frameborder="0"
                scrolling="no"
                allowfullscreen
              ></iframe>
            </React.Fragment>
          )
        } else if (node.data.target.sys.contentType.sys.id === "trelloEmbed") {
          return (
            <React.Fragment>
              <iframe
                title={`${node.data.target.fields.title["en-US"]}`}
                width="100%"
                height="600"
                src={`${node.data.target.fields.src["en-US"] + ".html"}`}
                frameBorder="0"
              ></iframe>
            </React.Fragment>
          )
        } else if (
          node.data.target.sys.contentType.sys.id === "figmaPageEmbed"
        ) {
          return (
            <React.Fragment>
              <iframe
                title={`${node.data.target.fields.title["en-US"]}`}
                width="100%"
                height="600"
                src={`${node.data.target.fields.src["en-US"]}`}
                allowfullscreen
              ></iframe>
            </React.Fragment>
          )
        } else if (
          node.data.target.sys.contentType.sys.id === "figmaPrototypeEmbed"
        ) {
          return (
            <React.Fragment>
              <iframe
                title={`${node.data.target.fields.title["en-US"]}`}
                width="100%"
                height="800"
                src={`${node.data.target.fields.src["en-US"]}`}
                allowfullscreen
              ></iframe>
            </React.Fragment>
          )
        } else if (node.data.target.sys.contentType.sys.id === "grid") {
          var num_of_indexes = `${node.data.target.fields.text["en-US"].content.length}`
          var col = 0

          for (var j = 0; j <= num_of_indexes - 1; j++) {
            if (
              node.data.target.fields.text["en-US"].content[j].nodeType === "hr"
            ) {
              col++
            }
          }

          // console.log(`${node.data.target.fields.title["en-US"]}`)
          // console.log(`${col}`)

          var width = 100 / col - 1 + "%"
          var renders = []

          var hr_found = false
          var hr_at = 0
          var hr_previously_at = 0
          var first_time = 1
          var img_num = 0

          for (var i = 0; i <= num_of_indexes - 1; i++) {
            console.log(`${i}`)
            if (
              node.data.target.fields.text["en-US"].content[i].nodeType ===
                "hr" &&
              hr_found === false
            ) {
              hr_found = true
              hr_previously_at = hr_at
              hr_at = i
              // console.log(`horizontal rule found at ${hr_at}`)
            } else if (
              hr_found === true &&
              hr_at - hr_previously_at + first_time === 3
            ) {
              renders.push(
                <div
                  className={blogTemplateStyles.col}
                  style={{
                    width: width,
                  }}
                >
                  <div className={blogTemplateStyles.heading}>
                    {documentToReactComponents(
                      node.data.target.fields.text["en-US"].content[hr_at - 2],
                      options
                    )}{" "}
                  </div>
                  {documentToReactComponents(
                    node.data.target.fields.text["en-US"].content[hr_at - 1],
                    options
                  )}
                </div>
              )
              first_time = 0
              hr_found = false
            } else if (
              hr_found === true &&
              hr_at - hr_previously_at + first_time === 4
            ) {
              if (node.data.target.fields.hasImages["en-US"] === true) {
                renders.push(
                  <div
                    className={blogTemplateStyles.col}
                    style={{
                      width: width,
                    }}
                  >
                    <img
                      className={blogTemplateStyles.icon}
                      src={`${node.data.target.fields.images["en-US"][img_num].fields.file["en-US"].url}`}
                      alt={`${node.data.target.fields.images["en-US"][img_num].fields.description["en-US"]}`}
                    />
                    <div className={blogTemplateStyles.heading}>
                      {documentToReactComponents(
                        node.data.target.fields.text["en-US"].content[
                          hr_at - 3
                        ],
                        options
                      )}
                    </div>
                    {documentToReactComponents(
                      node.data.target.fields.text["en-US"].content[hr_at - 2],
                      options
                    )}
                    {documentToReactComponents(
                      node.data.target.fields.text["en-US"].content[hr_at - 1],
                      options
                    )}
                  </div>
                )
              } else {
                renders.push(
                  <div
                    className={blogTemplateStyles.col}
                    style={{
                      width: width,
                    }}
                  >
                    <div className={blogTemplateStyles.heading}>
                      {documentToReactComponents(
                        node.data.target.fields.text["en-US"].content[
                          hr_at - 3
                        ],
                        options
                      )}
                    </div>
                    {documentToReactComponents(
                      node.data.target.fields.text["en-US"].content[hr_at - 2],
                      options
                    )}
                    {documentToReactComponents(
                      node.data.target.fields.text["en-US"].content[hr_at - 1],
                      options
                    )}
                  </div>
                )
              }

              img_num++
              first_time = 0
              hr_found = false
            }
          }

          console.log(`section is finished`)

          return (
            <div className={blogTemplateStyles.flexGrid}>
              {renders.map(render => (
                <React.Fragment key={render}>{render}</React.Fragment>
              ))}
            </div>
          )
        }
      },
      [INLINES.HYPERLINK]: node => {
        return (
          <a
            href={node.data.uri}
            target={`${
              node.data.uri.startsWith(website_url) ? "_self" : "_blank"
            }`}
            rel={`${
              node.data.uri.startsWith(website_url) ? "" : "noopener noreferrer"
            }`}
          >
            {node.content[0].value}
          </a>
        )
      },
      [BLOCKS.QUOTE]: (node, children) => {
        return (
          <div className={blogTemplateStyles.quoteDiv}>
            {" "}
            <div class={blogTemplateStyles.mbStyle2}>
              <blockquote>{children}</blockquote>
            </div>
          </div>
        )
      },
      [BLOCKS.HEADING_1]: (node, children) => {
        return (
          <React.Fragment>
            <h1>{children}</h1>
          </React.Fragment>
        )
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        return (
          <React.Fragment>
            <br />
            <br />
            <h2>{children}</h2>
            <hr />
          </React.Fragment>
        )
      },
      [BLOCKS.HEADING_3]: (node, children) => {
        return (
          <React.Fragment>
            <br />
            <h3>{children}</h3>
          </React.Fragment>
        )
      },
    },
  }
  return (
    <div className={blogTemplateStyles.postLayout}>
      <Head title={props.data.contentfulBlogPost.title} />
      <div className={blogTemplateStyles.post}>
        {documentToReactComponents(
          props.data.contentfulBlogPost.body.json,
          options
        )}
      </div>
    </div>
  )
}

export default Blog
