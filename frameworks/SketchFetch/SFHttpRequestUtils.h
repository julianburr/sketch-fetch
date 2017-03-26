//
//  SFHttpRequestUtils.h
//  SketchFetch
//
//  Created by Julian Burr on 26/3/17.
//  Copyright © 2017 Julian Burr. All rights reserved.
//

#ifndef SFHttpRequestUtils_h
#define SFHttpRequestUtils_h

@interface SFHttpRequestUtils:NSObject

+(void)sendRequest:(NSURLRequest *)request withMetaData:(NSDictionary*)metaData withIdentifier:(NSString *)identifier;

+(void)setResponse:(NSDictionary *)response forIdentifier:(NSString *)identifier;
+(NSDictionary *)getResponseForIdentifier:(NSString *)identifier;

@end

#endif /* SFHttpRequestUtils_h */
